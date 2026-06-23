from sqlalchemy import Select, func, or_, select
from sqlalchemy.orm import Session, selectinload

from app.models.job import CleanJob, RawJob
from app.models.skill import JobSkill, Skill
from app.schemas.job import JobDetail, JobOut, SkillOut


def _skill_out(job_skill: JobSkill) -> SkillOut:
    return SkillOut(id=job_skill.skill.id, name=job_skill.skill.name, category=job_skill.skill.category)


def to_job_out(job: CleanJob) -> JobOut:
    return JobOut(
        id=job.id,
        source=job.raw_job.source,
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
        posted_at=job.posted_at,
        collected_at=job.raw_job.collected_at,
        job_url=job.job_url,
        created_at=job.created_at,
        skills=[_skill_out(item) for item in job.skills],
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
