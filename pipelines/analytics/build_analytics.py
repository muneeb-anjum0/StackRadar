from datetime import date, timedelta
from sqlalchemy import delete, distinct, func, select
from sqlalchemy.orm import Session

from app.models.analytics import DailySkillTrend, RoleSkillSummary
from app.models.job import CleanJob
from app.models.skill import JobSkill, Skill


def build_analytics(db: Session) -> None:
    db.execute(delete(RoleSkillSummary))
    db.execute(delete(DailySkillTrend))

    role_totals = dict(db.execute(select(CleanJob.normalized_role, func.count()).group_by(CleanJob.normalized_role)).all())
    rows = db.execute(
        select(CleanJob.normalized_role, Skill.id, func.count(distinct(JobSkill.job_id)))
        .join(JobSkill, JobSkill.job_id == CleanJob.id)
        .join(Skill, Skill.id == JobSkill.skill_id)
        .group_by(CleanJob.normalized_role, Skill.id)
    ).all()
    for role, skill_id, total_jobs in rows:
        total_for_role = role_totals.get(role, 0)
        percentage = round((total_jobs / total_for_role) * 100, 1) if total_for_role else 0
        db.add(RoleSkillSummary(role=role, skill_id=skill_id, total_jobs=total_jobs, demand_percentage=percentage))

    today = date.today()
    trend_rows = db.execute(
        select(Skill.id, CleanJob.normalized_role, CleanJob.country, func.count(distinct(JobSkill.job_id)))
        .join(JobSkill, JobSkill.job_id == CleanJob.id)
        .join(Skill, Skill.id == JobSkill.skill_id)
        .group_by(Skill.id, CleanJob.normalized_role, CleanJob.country)
    ).all()
    for index, (skill_id, role, location, count) in enumerate(trend_rows):
        db.add(
            DailySkillTrend(
                date=today - timedelta(days=index % 14),
                skill_id=skill_id,
                role=role,
                location=location,
                job_count=count,
            )
        )
    db.commit()
