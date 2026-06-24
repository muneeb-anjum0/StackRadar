from __future__ import annotations

import argparse
import os
from dataclasses import dataclass
from datetime import datetime
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.db import SessionLocal, create_tables
from app.models.job import RawJob
from pipelines.analytics.build_analytics import build_analytics
from pipelines.cleaners.clean_jobs import clean_raw_jobs
from pipelines.collectors.adzuna import fetch_adzuna_jobs
from pipelines.collectors.base import RawJobRecord
from pipelines.collectors.remotive import fetch_remotive_jobs
from pipelines.events.producer import publish_raw_jobs
from pipelines.quality.run_quality_checks import run_quality_checks
from pipelines.tracking import finish_pipeline_run, pipeline_run, upsert_source_health


@dataclass
class CollectSummary:
    source: str
    fetched: int = 0
    inserted: int = 0
    skipped_duplicates: int = 0
    failed: int = 0


def insert_records(db: Session, records: list[RawJobRecord], source: str) -> CollectSummary:
    summary = CollectSummary(source=source, fetched=len(records))
    existing = {
        (row.source, row.source_job_id)
        for row in db.scalars(select(RawJob).where(RawJob.source == source, RawJob.source_job_id.is_not(None))).all()
    }
    seen: set[tuple[str, str | None]] = set()

    for record in records:
        key = (record.source, record.source_job_id)
        if record.source_job_id and (key in existing or key in seen):
            summary.skipped_duplicates += 1
            continue
        try:
            db.add(
                RawJob(
                    source=record.source,
                    source_job_id=record.source_job_id,
                    raw_title=record.raw_title,
                    raw_company=record.raw_company,
                    raw_location=record.raw_location,
                    raw_description=record.raw_description,
                    raw_salary=record.raw_salary,
                    job_url=record.job_url,
                    posted_at=record.posted_at,
                    raw_json=record.raw_json,
                    collected_at=datetime.utcnow(),
                )
            )
            summary.inserted += 1
            seen.add(key)
        except Exception as exc:
            summary.failed += 1
            print(f"Failed to insert {record.source}:{record.source_job_id}: {exc}")
    db.commit()
    return summary


def fetch_source(source: str, query: str, country: str, limit: int) -> list[RawJobRecord]:
    if source == "remotive":
        return fetch_remotive_jobs(query=query, limit=limit)
    if source == "adzuna":
        return fetch_adzuna_jobs(query=query, country=country, limit=limit)
    raise ValueError(f"Unsupported source: {source}")


def run_pipeline(db: Session) -> None:
    clean_stats = clean_raw_jobs(db)
    build_analytics(db)
    run_quality_checks(db, clean_stats)


def collect_live(source: str, query: str, country: str, limit: int, rebuild: bool = True, mode: str | None = None) -> list[CollectSummary]:
    create_tables()
    mode = mode or os.getenv("PIPELINE_MODE", "direct")
    sources = ["remotive", "adzuna"] if source == "all" else [source]
    db = SessionLocal()
    summaries: list[CollectSummary] = []
    try:
        for item in sources:
            run_type = "live_collect_kafka" if mode == "kafka" else "live_collect_direct"
            with pipeline_run(db, run_type, item) as run:
                try:
                    records = fetch_source(item, query=query, country=country, limit=limit)
                    if mode == "kafka":
                        publish = publish_raw_jobs(records)
                        summary = CollectSummary(source=item, fetched=len(records), inserted=publish.published, failed=publish.failed)
                        message = f"Published {publish.published} {item} raw job events to {publish.topic}."
                    else:
                        summary = insert_records(db, records, item)
                        message = f"Inserted {summary.inserted} {item} raw jobs directly."
                    finish_pipeline_run(
                        db,
                        run,
                        raw_inserted=summary.inserted,
                        duplicates_skipped=summary.skipped_duplicates,
                        failed_count=summary.failed,
                        message=message,
                    )
                    upsert_source_health(
                        db,
                        item,
                        summary.fetched,
                        summary.inserted,
                        summary.skipped_duplicates,
                        summary.failed,
                    )
                except Exception as exc:
                    print(f"{item} collection failed: {exc}")
                    summary = CollectSummary(source=item, failed=1)
                    finish_pipeline_run(db, run, status="failed", failed_count=1, message=str(exc))
                    upsert_source_health(db, item, summary.fetched, summary.inserted, summary.skipped_duplicates, summary.failed, str(exc))
            summaries.append(summary)
            print(
                f"{summary.source}: fetched={summary.fetched} inserted={summary.inserted} "
                f"duplicates={summary.skipped_duplicates} failed={summary.failed}"
            )
        if rebuild and mode == "direct":
            run_pipeline(db)
            print("Rebuilt clean jobs, analytics and quality checks.")
            for summary in summaries:
                upsert_source_health(
                    db,
                    summary.source,
                    summary.fetched,
                    summary.inserted,
                    summary.skipped_duplicates,
                    summary.failed,
                )
        elif mode == "kafka":
            print("Kafka mode published events only. Run kafka-consume, then refresh analytics.")
    finally:
        db.close()
    return summaries


def main() -> None:
    parser = argparse.ArgumentParser(description="Collect live jobs into raw_jobs and rebuild StackRadar analytics.")
    parser.add_argument("--source", choices=["remotive", "adzuna", "all"], default="all")
    parser.add_argument("--limit", type=int, default=500)
    parser.add_argument("--query", default="software developer")
    parser.add_argument("--country", default="gb")
    parser.add_argument("--mode", choices=["direct", "kafka"], default=os.getenv("PIPELINE_MODE", "direct"))
    parser.add_argument("--skip-pipeline", action="store_true")
    args = parser.parse_args()
    collect_live(args.source, args.query, args.country, args.limit, rebuild=not args.skip_pipeline, mode=args.mode)


if __name__ == "__main__":
    main()
