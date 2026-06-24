from __future__ import annotations

from sqlalchemy.orm import Session

from app.services.analytics_service import overview, role_analytics, skill_gap, source_summary


def build_context(db: Session, target_role: str, current_skills: list[str], weeks: int = 4) -> dict:
    role = role_analytics(db, target_role)
    gap = skill_gap(db, target_role, current_skills)
    summary = overview(db)
    sources = source_summary(db)
    warning = None
    if role.total_jobs < 5:
        warning = "Limited data available for this role, report confidence may be lower."

    return {
        "target_role": target_role,
        "current_skills": current_skills,
        "matched_skills": gap.matched_skills,
        "missing_skills": gap.missing_skills,
        "recommended_next_skills": gap.recommended_next_skills,
        "match_percentage": gap.match_percentage,
        "top_role_skills": [item.model_dump() for item in role.top_skills[:10]],
        "role_job_count": role.total_jobs,
        "top_companies": [item.model_dump() for item in role.top_companies[:5]],
        "salary_range": {"min": role.salary_min, "max": role.salary_max},
        "work_mode_distribution": [item.model_dump() for item in role.common_work_modes],
        "data_quality_score": summary.data_quality_score,
        "source_summary": sources.model_dump(),
        "freshness_info": sources.last_collected_at,
        "weeks": weeks,
        "confidence_note": warning,
    }
