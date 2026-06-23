from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.analytics import DataQualityRun
from app.schemas.quality import QualityIssue, QualitySummary


def latest_summary(db: Session) -> QualitySummary:
    run = db.scalar(select(DataQualityRun).order_by(DataQualityRun.run_at.desc()).limit(1))
    if not run:
        return QualitySummary(
            run_at=None,
            total_raw_jobs=0,
            total_clean_jobs=0,
            duplicate_count=0,
            missing_title_count=0,
            missing_company_count=0,
            missing_description_count=0,
            missing_salary_count=0,
            invalid_salary_count=0,
            jobs_without_skills_count=0,
            quality_score=0,
        )
    return QualitySummary.model_validate(run, from_attributes=True)


def quality_issues(db: Session) -> list[QualityIssue]:
    summary = latest_summary(db)
    checks = [
        ("high", "Duplicate postings", "Likely repeated jobs removed during cleaning.", summary.duplicate_count),
        ("medium", "Missing salary", "Jobs without salary reduce compensation insight coverage.", summary.missing_salary_count),
        ("medium", "Missing company", "Company normalization could not resolve every posting.", summary.missing_company_count),
        ("medium", "Jobs without skills", "No dictionary skills were found in these descriptions.", summary.jobs_without_skills_count),
        ("low", "Invalid salary", "Salary text was present but could not be parsed.", summary.invalid_salary_count),
        ("low", "Missing descriptions", "Descriptions are needed for skill extraction.", summary.missing_description_count),
    ]
    return [QualityIssue(severity=s, title=t, description=d, count=c) for s, t, d, c in checks if c > 0]
