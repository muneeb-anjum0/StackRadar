from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.analytics import DataQualityRun, PipelineRun, SourceHealth, ValidationResult
from app.models.job import CleanJob, RawJob
from app.schemas.quality import PipelineRunOut, QualityIssue, QualitySummary, SourceHealthOut, ValidationCheckOut
from app.services.jobs_service import classification_signal


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
            noisy_classification_count=0,
            quality_score=0,
        )
    summary = QualitySummary.model_validate(run, from_attributes=True)
    rows = db.scalars(select(CleanJob).join(RawJob).limit(500)).all()
    summary.noisy_classification_count = sum(1 for row in rows if classification_signal(row)[3])
    return summary


def quality_issues(db: Session) -> list[QualityIssue]:
    summary = latest_summary(db)
    checks = [
        ("high", "Duplicate postings", "Likely repeated jobs removed during cleaning.", summary.duplicate_count),
        ("medium", "Missing salary", "Jobs without salary reduce compensation insight coverage.", summary.missing_salary_count),
        ("medium", "Missing company", "Company normalization could not resolve every posting.", summary.missing_company_count),
        ("medium", "Jobs without skills", "No dictionary skills were found in these descriptions.", summary.jobs_without_skills_count),
        ("medium", "Noisy classifications", "Postings whose title, role or extracted skills need review.", summary.noisy_classification_count),
        ("low", "Invalid salary", "Salary text was present but could not be parsed.", summary.invalid_salary_count),
        ("low", "Missing descriptions", "Descriptions are needed for skill extraction.", summary.missing_description_count),
    ]
    return [QualityIssue(severity=s, title=t, description=d, count=c) for s, t, d, c in checks if c > 0]


def latest_pipeline_runs(db: Session, limit: int = 20) -> list[PipelineRunOut]:
    rows = db.scalars(select(PipelineRun).order_by(PipelineRun.started_at.desc()).limit(limit)).all()
    return [PipelineRunOut.model_validate(row, from_attributes=True) for row in rows]


def source_health(db: Session) -> list[SourceHealthOut]:
    rows = db.scalars(select(SourceHealth).order_by(SourceHealth.source)).all()
    output: list[SourceHealthOut] = []
    for row in rows:
        raw_count = db.scalar(select(func.count(RawJob.id)).where(RawJob.source == row.source)) or 0
        clean_count = db.scalar(
            select(func.count(CleanJob.id)).join(RawJob, RawJob.id == CleanJob.raw_job_id).where(RawJob.source == row.source)
        ) or 0
        clean_rate = round((clean_count / raw_count) * 100, 1) if raw_count else row.avg_clean_rate
        output.append(
            SourceHealthOut(
            source=row.source,
            status=row.status,
            last_attempt_at=row.last_attempt_at,
            last_success_at=row.last_success_at,
            fetched_count=row.fetched_count,
            inserted_count=row.inserted_count,
            skipped_duplicates=row.skipped_duplicates,
            failed_count=row.failed_count,
            clean_rate=clean_rate,
            last_error=row.last_error,
            )
        )
    return output


def latest_validations(db: Session) -> list[ValidationCheckOut]:
    latest_run = db.scalar(select(ValidationResult.run_at).order_by(ValidationResult.run_at.desc()).limit(1))
    if latest_run is None:
        return []
    rows = db.scalars(select(ValidationResult).where(ValidationResult.run_at == latest_run).order_by(ValidationResult.severity, ValidationResult.check_name)).all()
    return [ValidationCheckOut.model_validate(row, from_attributes=True) for row in rows]
