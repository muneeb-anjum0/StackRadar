from __future__ import annotations

from contextlib import contextmanager
from datetime import datetime
from typing import Iterator

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.analytics import PipelineRun, SourceHealth
from app.models.job import CleanJob, RawJob


@contextmanager
def pipeline_run(db: Session, run_type: str, source: str | None = None, message: str | None = None) -> Iterator[PipelineRun]:
    run = PipelineRun(run_type=run_type, source=source, started_at=datetime.utcnow(), status="running", message=message)
    db.add(run)
    db.commit()
    db.refresh(run)
    try:
        yield run
    except Exception as exc:
        finish_pipeline_run(db, run, status="failed", failed_count=1, message=str(exc))
        raise


def finish_pipeline_run(
    db: Session,
    run: PipelineRun,
    status: str = "success",
    raw_inserted: int = 0,
    clean_created: int = 0,
    duplicates_skipped: int = 0,
    failed_count: int = 0,
    message: str | None = None,
) -> PipelineRun:
    run.status = status
    run.finished_at = datetime.utcnow()
    run.raw_inserted = raw_inserted
    run.clean_created = clean_created
    run.duplicates_skipped = duplicates_skipped
    run.failed_count = failed_count
    if message is not None:
        run.message = message
    db.add(run)
    db.commit()
    db.refresh(run)
    return run


def upsert_source_health(
    db: Session,
    source: str,
    fetched_count: int,
    inserted_count: int,
    skipped_duplicates: int,
    failed_count: int,
    error: str | None = None,
) -> SourceHealth:
    now = datetime.utcnow()
    health = db.scalar(select(SourceHealth).where(SourceHealth.source == source))
    if health is None:
        health = SourceHealth(source=source)
        db.add(health)

    clean_count = db.scalar(
        select(func.count(CleanJob.id)).join(RawJob, RawJob.id == CleanJob.raw_job_id).where(RawJob.source == source)
    ) or 0
    raw_count = db.scalar(select(func.count(RawJob.id)).where(RawJob.source == source)) or 0

    health.last_attempt_at = now
    health.status = "failed" if failed_count or error else "healthy"
    health.fetched_count = fetched_count
    health.inserted_count = inserted_count
    health.skipped_duplicates = skipped_duplicates
    health.failed_count = failed_count
    health.last_error = error
    health.avg_clean_rate = round((clean_count / raw_count) * 100, 1) if raw_count else 0
    if health.status == "healthy":
        health.last_success_at = now

    db.commit()
    db.refresh(health)
    return health
