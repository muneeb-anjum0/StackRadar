from datetime import datetime, timedelta

from sqlalchemy import distinct, func, select
from sqlalchemy.orm import Session

from app.models.analytics import DataQualityRun, SourceHealth, ValidationResult
from app.models.job import CleanJob, RawJob
from app.models.skill import JobSkill
from pipelines.tracking import finish_pipeline_run, pipeline_run


def run_quality_checks(db: Session, clean_stats: dict[str, int] | None = None) -> DataQualityRun:
    with pipeline_run(db, "quality_check") as pipeline:
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
        db.flush()
        _store_validation_results(
            db,
            total_raw=total_raw,
            total_clean=total_clean,
            missing_title=missing_title,
            missing_company=missing_company,
            missing_description=missing_description,
            duplicate_count=duplicate_count,
            without_skills=without_skills,
        )
        db.commit()
        db.refresh(run)
        finish_pipeline_run(db, pipeline, message=f"Quality score is {run.quality_score}%.")
        return run


def _store_validation_results(
    db: Session,
    total_raw: int,
    total_clean: int,
    missing_title: int,
    missing_company: int,
    missing_description: int,
    duplicate_count: int,
    without_skills: int,
) -> None:
    now = datetime.utcnow()
    bad_salary = db.scalar(
        select(func.count()).select_from(CleanJob).where(CleanJob.salary_min.is_not(None), CleanJob.salary_max.is_not(None), CleanJob.salary_min > CleanJob.salary_max)
    ) or 0
    jobs_with_skills = db.scalar(select(func.count(distinct(JobSkill.job_id)))) or 0
    stale_sources = db.scalar(
        select(func.count())
        .select_from(SourceHealth)
        .where(SourceHealth.last_success_at.is_not(None), SourceHealth.last_success_at < now - timedelta(days=7))
    ) or 0
    clean_rate_failed = 1 if total_raw and (total_clean / total_raw) < 0.65 else 0
    duplicate_rate_failed = 1 if total_raw and (duplicate_count / total_raw) > 0.25 else 0
    checks = [
        ("raw_jobs_has_records", total_raw == 0, total_raw, "high", "Raw ingestion has no records."),
        ("clean_jobs_has_records", total_clean == 0, total_clean, "high", "Cleaning has not produced analytics-ready jobs."),
        ("title_is_not_missing", missing_title, total_raw, "high", "Raw job title is required for role normalization."),
        ("company_is_not_missing", missing_company, total_raw, "medium", "Missing company reduces employer insight."),
        ("description_is_not_missing", missing_description, total_raw, "high", "Description is required for skill extraction."),
        ("salary_min_less_than_salary_max", bad_salary, total_clean, "high", "Parsed salary ranges should be ordered."),
        ("jobs_have_extracted_skills", max(total_clean - jobs_with_skills, without_skills), total_clean, "medium", "Skill extraction should cover most clean jobs."),
        ("duplicate_rate_below_threshold", duplicate_rate_failed, total_raw, "medium", "Duplicate raw postings are above the target threshold."),
        ("clean_rate_is_acceptable", clean_rate_failed, total_raw, "high", "Too many raw jobs are being dropped during cleaning."),
        ("source_freshness_is_acceptable", stale_sources, db.scalar(select(func.count()).select_from(SourceHealth)) or 0, "medium", "A source has not succeeded in the last seven days."),
    ]
    for name, failed_count, total_count, severity, message in checks:
        failed = int(failed_count)
        db.add(
            ValidationResult(
                run_at=now,
                check_name=name,
                status="failed" if failed else "passed",
                failed_count=failed,
                total_count=int(total_count or 0),
                severity=severity,
                message=message if failed else None,
            )
        )
