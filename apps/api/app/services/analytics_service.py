from collections import Counter
from sqlalchemy import case, distinct, func, select
from sqlalchemy.orm import Session

from app.models.analytics import DataQualityRun, DailySkillTrend
from app.models.job import CleanJob, RawJob
from app.models.skill import JobSkill, Skill
from app.schemas.analytics import CountItem, OverviewOut, RoleAnalyticsOut, SkillGapResponse, SkillTrendOut, SourceItem, SourceSummaryOut


def _percentage(count: int, total: int) -> float:
    return round((count / total) * 100, 1) if total else 0


def _count_items(rows: list[tuple[str, int]], total: int) -> list[CountItem]:
    return [CountItem(name=name or "Unknown", count=count, percentage=_percentage(count, total)) for name, count in rows]


def overview(db: Session) -> OverviewOut:
    total_jobs = db.scalar(select(func.count()).select_from(CleanJob)) or 0
    total_companies = db.scalar(select(func.count(distinct(CleanJob.company)))) or 0
    total_skills = db.scalar(select(func.count()).select_from(Skill)) or 0
    top_role = db.execute(
        select(CleanJob.normalized_role, func.count().label("count"))
        .group_by(CleanJob.normalized_role)
        .order_by(func.count().desc())
        .limit(1)
    ).first()
    top_skill = db.execute(
        select(Skill.name, func.count(JobSkill.id).label("count"))
        .join(JobSkill, JobSkill.skill_id == Skill.id)
        .group_by(Skill.name)
        .order_by(func.count(JobSkill.id).desc())
        .limit(1)
    ).first()
    remote_count = db.scalar(select(func.count()).where(CleanJob.work_mode == "Remote")) or 0
    avg_salary = db.scalar(
        select(func.avg((CleanJob.salary_min + CleanJob.salary_max) / 2)).where(CleanJob.salary_min.is_not(None))
    )
    quality = db.scalar(select(DataQualityRun.quality_score).order_by(DataQualityRun.run_at.desc()).limit(1)) or 0
    return OverviewOut(
        total_jobs=total_jobs,
        total_companies=total_companies,
        total_skills=total_skills,
        most_common_role=top_role[0] if top_role else None,
        most_demanded_skill=top_skill[0] if top_skill else None,
        remote_job_percentage=_percentage(remote_count, total_jobs),
        average_salary=round(avg_salary, 0) if avg_salary else None,
        data_quality_score=round(quality, 1),
    )


def top_skills(db: Session, limit: int = 15) -> list[CountItem]:
    total_jobs = db.scalar(select(func.count()).select_from(CleanJob)) or 0
    rows = db.execute(
        select(Skill.name, func.count(distinct(JobSkill.job_id)).label("count"))
        .join(JobSkill, JobSkill.skill_id == Skill.id)
        .group_by(Skill.name)
        .order_by(func.count(distinct(JobSkill.job_id)).desc())
        .limit(limit)
    ).all()
    return _count_items(rows, total_jobs)


def top_roles(db: Session) -> list[CountItem]:
    total = db.scalar(select(func.count()).select_from(CleanJob)) or 0
    rows = db.execute(
        select(CleanJob.normalized_role, func.count().label("count"))
        .group_by(CleanJob.normalized_role)
        .order_by(func.count().desc())
    ).all()
    return _count_items(rows, total)


def distribution(db: Session, field: str) -> list[CountItem]:
    column = getattr(CleanJob, field)
    total = db.scalar(select(func.count()).select_from(CleanJob)) or 0
    rows = db.execute(select(column, func.count()).group_by(column).order_by(func.count().desc())).all()
    return _count_items(rows, total)


def role_analytics(db: Session, role: str) -> RoleAnalyticsOut:
    jobs = db.scalars(select(CleanJob).where(CleanJob.normalized_role == role)).all()
    total = len(jobs)
    top_skill_rows = db.execute(
        select(Skill.name, func.count(distinct(JobSkill.job_id)))
        .join(JobSkill, JobSkill.skill_id == Skill.id)
        .join(CleanJob, CleanJob.id == JobSkill.job_id)
        .where(CleanJob.normalized_role == role)
        .group_by(Skill.name)
        .order_by(func.count(distinct(JobSkill.job_id)).desc())
        .limit(10)
    ).all()
    mode_rows = Counter(job.work_mode for job in jobs).most_common()
    seniority_rows = Counter(job.seniority for job in jobs).most_common()
    company_rows = Counter(job.company or "Unknown" for job in jobs).most_common(8)
    salaries = [(job.salary_min, job.salary_max) for job in jobs if job.salary_min is not None and job.salary_max is not None]
    return RoleAnalyticsOut(
        role=role,
        total_jobs=total,
        top_skills=_count_items(top_skill_rows, total),
        common_work_modes=_count_items(mode_rows, total),
        salary_min=min((s[0] for s in salaries), default=None),
        salary_max=max((s[1] for s in salaries), default=None),
        seniority_distribution=_count_items(seniority_rows, total),
        top_companies=_count_items(company_rows, total),
    )


def skill_trends(db: Session) -> list[SkillTrendOut]:
    rows = db.execute(
        select(DailySkillTrend.date, Skill.name, DailySkillTrend.role, DailySkillTrend.location, DailySkillTrend.job_count)
        .join(Skill, Skill.id == DailySkillTrend.skill_id)
        .order_by(DailySkillTrend.date, Skill.name)
    ).all()
    return [
        SkillTrendOut(date=row[0].isoformat(), skill=row[1], role=row[2], location=row[3], job_count=row[4])
        for row in rows
    ]


def source_summary(db: Session) -> SourceSummaryOut:
    rows = db.execute(
        select(
            RawJob.source,
            func.count(RawJob.id),
            func.count(CleanJob.id),
            func.max(RawJob.collected_at),
            func.sum(case((RawJob.raw_salary.is_(None), 1), else_=0)),
        )
        .outerjoin(CleanJob, CleanJob.raw_job_id == RawJob.id)
        .group_by(RawJob.source)
        .order_by(RawJob.source)
    ).all()
    items = [
        SourceItem(
            source=row[0],
            raw_jobs=row[1],
            clean_jobs=row[2],
            last_collected_at=row[3].isoformat() if row[3] else None,
            missing_salary_count=row[4] or 0,
        )
        for row in rows
    ]
    last_collected = max((item.last_collected_at for item in items if item.last_collected_at), default=None)
    live_sources = {item.source for item in items if item.source not in {"sample", "sample_board"}}
    return SourceSummaryOut(
        total_sources=len(items),
        total_raw_jobs=sum(item.raw_jobs for item in items),
        total_clean_jobs=sum(item.clean_jobs for item in items),
        last_collected_at=last_collected,
        mode="live/API-backed" if live_sources else "sample-only",
        sources=items,
    )


def skill_gap(db: Session, target_role: str, current_skills: list[str]) -> SkillGapResponse:
    role = role_analytics(db, target_role)
    required = [item.name for item in role.top_skills[:10]]
    current_lookup = {skill.strip().lower() for skill in current_skills if skill.strip()}
    matched = [skill for skill in required if skill.lower() in current_lookup]
    missing = [skill for skill in required if skill.lower() not in current_lookup]
    match_percentage = _percentage(len(matched), len(required))
    recommended = missing[:3]
    if not required:
        summary = f"No strong demand pattern is available yet for {target_role}."
    elif recommended:
        summary = f"You match {len(matched)} of the top {len(required)} {target_role} skills. Prioritize {', '.join(recommended)} next."
    else:
        summary = f"Strong fit for {target_role}. Your current skills cover the top observed demand signals."
    return SkillGapResponse(
        target_role=target_role,
        match_percentage=match_percentage,
        matched_skills=matched,
        missing_skills=missing,
        recommended_next_skills=recommended,
        summary=summary,
    )
