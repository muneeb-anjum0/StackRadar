from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.analytics import DataQualityRun
from app.models.job import CleanJob, RawJob


def run_quality_checks(db: Session, clean_stats: dict[str, int] | None = None) -> DataQualityRun:
    clean_stats = clean_stats or {}
    raw_jobs = db.scalars(select(RawJob)).all()
    total_raw = len(raw_jobs)
    total_clean = db.scalar(select(func.count()).select_from(CleanJob)) or 0
    missing_title = sum(1 for job in raw_jobs if not job.raw_title)
    missing_company = sum(1 for job in raw_jobs if not job.raw_company)
    missing_description = sum(1 for job in raw_jobs if not job.raw_description)
    missing_salary = sum(1 for job in raw_jobs if not job.raw_salary or "competitive" in job.raw_salary.lower() or "not disclosed" in job.raw_salary.lower())
    duplicate_count = clean_stats.get("duplicate_count", max(total_raw - total_clean, 0))
    invalid_salary = clean_stats.get("invalid_salary_count", 0)
    without_skills = clean_stats.get("jobs_without_skills_count", 0)

    penalties = (
        duplicate_count * 1.5
        + missing_title * 2
        + missing_company * 1.5
        + missing_description * 2
        + missing_salary * 0.6
        + invalid_salary * 1.5
        + without_skills * 1.5
    )
    denominator = max(total_raw, 1)
    score = max(0, 100 - (penalties / denominator) * 10)

    run = DataQualityRun(
        total_raw_jobs=total_raw,
        total_clean_jobs=total_clean,
        duplicate_count=duplicate_count,
        missing_title_count=missing_title,
        missing_company_count=missing_company,
        missing_description_count=missing_description,
        missing_salary_count=missing_salary,
        invalid_salary_count=invalid_salary,
        jobs_without_skills_count=without_skills,
        quality_score=round(score, 1),
    )
    db.add(run)
    db.commit()
    db.refresh(run)
    return run
