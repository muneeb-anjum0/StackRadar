from sqlalchemy import Select, func, or_, select
from sqlalchemy.orm import Session, selectinload

from app.models.job import CleanJob, RawJob
from app.models.skill import JobSkill, Skill
from app.schemas.job import JobDetail, JobOut, SkillOut

NON_TECHNICAL_TITLE_KEYWORDS = {
    "sales",
    "copywriter",
    "writer",
    "assistant",
    "account payable",
    "customer operations",
    "office assistant",
    "financial sales",
    "customer support",
    "operations",
}

TECHNICAL_SKILL_CATEGORIES = {"frontend", "backend", "data", "ai", "cloud", "devops", "database", "language", "framework", "testing", "mobile", "tool"}
TECHNICAL_ROLE_KEYWORDS = {"developer", "engineer", "software", "data", "frontend", "backend", "mobile", "qa", "devops", "cloud", "analyst"}


def _skill_out(job_skill: JobSkill) -> SkillOut:
    return SkillOut(id=job_skill.skill.id, name=job_skill.skill.name, category=job_skill.skill.category)


def classification_signal(job: CleanJob) -> tuple[str, list[str], bool, bool]:
    title = f"{job.raw_job.raw_title or ''} {job.normalized_title or ''}".lower()
    role = (job.normalized_role or "").lower()
    skill_categories = {item.skill.category.lower() for item in job.skills if item.skill and item.skill.category}
    skill_names = {item.skill.name.lower() for item in job.skills if item.skill and item.skill.name}
    notes: list[str] = []
    score = 72

    noisy_terms = sorted(term for term in NON_TECHNICAL_TITLE_KEYWORDS if term in title)
    if noisy_terms:
        score -= 35
        notes.append(f"Title contains non-technical signal: {', '.join(noisy_terms)}")
    if role == "unknown":
        score -= 22
        notes.append("Role classifier returned Unknown")
    if not skill_names:
        score -= 25
        notes.append("No technical skills were extracted")
    if skill_categories & TECHNICAL_SKILL_CATEGORIES:
        score += 18
        notes.append("Extracted skills support a technical classification")
    if any(term in role for term in TECHNICAL_ROLE_KEYWORDS):
        score += 10
    if noisy_terms and any(term in role for term in {"frontend", "backend", "mobile", "qa"}):
        score -= 20
        notes.append("Role label may conflict with the source title")

    bounded = max(0, min(100, score))
    confidence = "high" if bounded >= 75 else "medium" if bounded >= 45 else "low"
    is_technical = bounded >= 45 and (bool(skill_names) or any(term in role for term in TECHNICAL_ROLE_KEYWORDS))
    needs_review = confidence == "low" or bool(noisy_terms) or role == "unknown"
    if not notes:
        notes.append("Role, title and extracted skills are consistent enough for analytics")
    return confidence, notes, is_technical, needs_review


def to_job_out(job: CleanJob) -> JobOut:
    confidence, notes, is_technical, needs_review = classification_signal(job)
    return JobOut(
        id=job.id,
        source=job.raw_job.source,
        raw_title=job.raw_job.raw_title,
        normalized_title=job.normalized_title,
        normalized_role=job.normalized_role,
        company=job.company,
        city=job.city,
        country=job.country,
        work_mode=job.work_mode,
        seniority=job.seniority,
        salary_min=job.salary_min,
        salary_max=job.salary_max,
        currency=job.currency,
        raw_salary=job.raw_job.raw_salary,
        posted_at=job.posted_at,
        collected_at=job.raw_job.collected_at,
        job_url=job.job_url,
        created_at=job.created_at,
        skills=[_skill_out(item) for item in job.skills],
        classification_confidence=confidence,
        classification_notes=notes,
        is_technical=is_technical,
        needs_review=needs_review,
    )


def to_job_detail(job: CleanJob) -> JobDetail:
    base = to_job_out(job).model_dump()
    return JobDetail(**base, raw_description=job.raw_job.raw_description)


def list_jobs(db: Session, limit: int = 50, offset: int = 0) -> tuple[int, list[JobOut]]:
    total = db.scalar(select(func.count()).select_from(CleanJob)) or 0
    rows = db.scalars(
        select(CleanJob)
        .options(selectinload(CleanJob.skills).selectinload(JobSkill.skill), selectinload(CleanJob.raw_job))
        .order_by(CleanJob.created_at.desc())
        .limit(limit)
        .offset(offset)
    ).all()
    return total, [to_job_out(row) for row in rows]


def get_job(db: Session, job_id: int) -> JobDetail | None:
    row = db.scalar(
        select(CleanJob)
        .where(CleanJob.id == job_id)
        .options(selectinload(CleanJob.skills).selectinload(JobSkill.skill), selectinload(CleanJob.raw_job))
    )
    return to_job_detail(row) if row else None


def search_jobs(
    db: Session,
    query: str | None = None,
    role: str | None = None,
    skill: str | None = None,
    work_mode: str | None = None,
    seniority: str | None = None,
    source: str | None = None,
    limit: int = 50,
) -> tuple[int, list[JobOut]]:
    stmt: Select = select(CleanJob).options(
        selectinload(CleanJob.skills).selectinload(JobSkill.skill),
        selectinload(CleanJob.raw_job),
    )
    if skill:
        stmt = stmt.join(JobSkill).join(Skill).where(func.lower(Skill.name) == skill.lower())
    if role:
        stmt = stmt.where(CleanJob.normalized_role == role)
    if work_mode:
        stmt = stmt.where(CleanJob.work_mode == work_mode)
    if seniority:
        stmt = stmt.where(CleanJob.seniority == seniority)
    if source:
        stmt = stmt.join(RawJob, RawJob.id == CleanJob.raw_job_id).where(func.lower(RawJob.source) == source.lower())
    if query:
        like = f"%{query.lower()}%"
        stmt = stmt.where(
            or_(
                func.lower(CleanJob.normalized_title).like(like),
                func.lower(CleanJob.company).like(like),
                func.lower(CleanJob.normalized_role).like(like),
            )
        )

    count_stmt = select(func.count()).select_from(stmt.order_by(None).subquery())
    total = db.scalar(count_stmt) or 0
    rows = db.scalars(stmt.order_by(CleanJob.created_at.desc()).limit(limit)).unique().all()
    return total, [to_job_out(row) for row in rows]
