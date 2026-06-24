import json
from pathlib import Path

from sqlalchemy import delete

from app.core.db import SessionLocal, create_tables
from app.models.analytics import DataQualityRun, DailySkillTrend, PipelineRun, RoleSkillSummary, SourceHealth, ValidationResult
from app.models.job import CleanJob, RawJob
from app.models.skill import JobSkill, Skill
from pipelines.analytics.build_analytics import build_analytics
from pipelines.cleaners.clean_jobs import clean_raw_jobs
from pipelines.quality.run_quality_checks import run_quality_checks
from pipelines.tracking import finish_pipeline_run, pipeline_run, upsert_source_health


SAMPLE_FILE = Path(__file__).with_name("sample_jobs.json")


def reset_tables(db) -> None:
    for model in [RoleSkillSummary, DailySkillTrend, ValidationResult, DataQualityRun, SourceHealth, PipelineRun, JobSkill, CleanJob, Skill, RawJob]:
        db.execute(delete(model))
    db.commit()


def seed_raw_jobs() -> None:
    create_tables()
    db = SessionLocal()
    try:
        reset_tables(db)
        with pipeline_run(db, "sample_seed", "sample") as run:
            records = json.loads(SAMPLE_FILE.read_text(encoding="utf-8"))
            for record in records:
                db.add(
                    RawJob(
                        source="sample",
                        source_job_id=record.get("source_job_id"),
                        raw_title=record.get("title"),
                        raw_company=record.get("company"),
                        raw_location=record.get("location"),
                        raw_description=record.get("description"),
                        raw_salary=record.get("salary"),
                        job_url=record.get("job_url"),
                        posted_at=None,
                        raw_json=record,
                    )
                )
            db.commit()
            clean_stats = clean_raw_jobs(db)
            build_analytics(db)
            run_quality_checks(db, clean_stats)
            upsert_source_health(db, "sample", len(records), len(records), 0, 0)
            finish_pipeline_run(
                db,
                run,
                raw_inserted=len(records),
                clean_created=clean_stats.get("clean_created", 0),
                message=f"Seeded {len(records)} sample jobs and rebuilt analytics.",
            )
            print(f"Seeded {len(records)} raw jobs and built analytics.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_raw_jobs()
