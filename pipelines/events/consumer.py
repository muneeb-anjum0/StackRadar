from __future__ import annotations

import argparse
from dataclasses import dataclass
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.db import SessionLocal, create_tables
from app.models.job import RawJob
from pipelines.events.serializers import decode_event, encode_event
from pipelines.events.topics import FAILED_JOBS_TOPIC, RAW_JOBS_TOPIC, bootstrap_servers
from pipelines.tracking import finish_pipeline_run, pipeline_run, upsert_source_health


REQUIRED_FIELDS = ["event_type", "source", "raw_title", "raw_company", "raw_description"]


@dataclass
class ConsumeSummary:
    inserted: int = 0
    skipped_duplicates: int = 0
    failed: int = 0
    read: int = 0


def _parse_datetime(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value)
    except ValueError:
        return None


def _validate_event(event: dict) -> None:
    missing = [field for field in REQUIRED_FIELDS if not event.get(field)]
    if missing:
        raise ValueError(f"Missing required event fields: {', '.join(missing)}")
    if event.get("event_type") != "raw_job_collected":
        raise ValueError(f"Unsupported event type: {event.get('event_type')}")


def _insert_event(db: Session, event: dict) -> str:
    _validate_event(event)
    source = event.get("source")
    source_job_id = event.get("source_job_id")
    if source_job_id:
        existing = db.scalar(select(RawJob.id).where(RawJob.source == source, RawJob.source_job_id == str(source_job_id)).limit(1))
        if existing:
            return "duplicate"

    db.add(
        RawJob(
            source=source,
            source_job_id=str(source_job_id) if source_job_id else None,
            raw_title=event.get("raw_title"),
            raw_company=event.get("raw_company"),
            raw_location=event.get("raw_location"),
            raw_description=event.get("raw_description"),
            raw_salary=event.get("raw_salary"),
            raw_json=event.get("raw_json") or event,
            job_url=event.get("job_url"),
            posted_at=_parse_datetime(event.get("posted_at")),
            collected_at=_parse_datetime(event.get("collected_at")) or datetime.utcnow(),
        )
    )
    db.commit()
    return "inserted"


def consume_raw_jobs(topic: str, max_messages: int, timeout_seconds: int) -> ConsumeSummary:
    try:
        from kafka import KafkaConsumer, KafkaProducer
    except ImportError as exc:
        raise RuntimeError("Kafka consumer requires the kafka-python package. Install backend requirements first.") from exc

    create_tables()
    consumer = KafkaConsumer(
        topic,
        bootstrap_servers=bootstrap_servers(),
        auto_offset_reset="earliest",
        enable_auto_commit=True,
        group_id="stackradar-raw-job-loader",
        consumer_timeout_ms=timeout_seconds * 1000,
        value_deserializer=decode_event,
    )
    failed_producer = KafkaProducer(bootstrap_servers=bootstrap_servers(), value_serializer=encode_event)
    db = SessionLocal()
    summary = ConsumeSummary()
    source_counts: dict[str, ConsumeSummary] = {}
    try:
        with pipeline_run(db, "kafka_consume", topic) as run:
            for message in consumer:
                summary.read += 1
                event = message.value
                source = str(event.get("source") or "unknown")
                source_summary = source_counts.setdefault(source, ConsumeSummary())
                source_summary.read += 1
                try:
                    outcome = _insert_event(db, event)
                    if outcome == "duplicate":
                        summary.skipped_duplicates += 1
                        source_summary.skipped_duplicates += 1
                    else:
                        summary.inserted += 1
                        source_summary.inserted += 1
                except Exception as exc:
                    summary.failed += 1
                    source_summary.failed += 1
                    failed_producer.send(FAILED_JOBS_TOPIC, value={"event": event, "error": str(exc), "failed_at": datetime.utcnow().isoformat()})
                if summary.read >= max_messages:
                    break
            failed_producer.flush()
            finish_pipeline_run(
                db,
                run,
                raw_inserted=summary.inserted,
                duplicates_skipped=summary.skipped_duplicates,
                failed_count=summary.failed,
                message=f"Consumed {summary.read} Kafka messages from {topic}.",
            )
            for source, counts in source_counts.items():
                upsert_source_health(db, source, counts.read, counts.inserted, counts.skipped_duplicates, counts.failed)
    finally:
        db.close()
        consumer.close()
        failed_producer.close()
    return summary


def main() -> None:
    parser = argparse.ArgumentParser(description="Consume StackRadar raw job events from Kafka into PostgreSQL.")
    parser.add_argument("--topic", default=RAW_JOBS_TOPIC)
    parser.add_argument("--max-messages", type=int, default=1000)
    parser.add_argument("--timeout-seconds", type=int, default=30)
    args = parser.parse_args()
    summary = consume_raw_jobs(args.topic, args.max_messages, args.timeout_seconds)
    print(
        f"Kafka consume: read={summary.read} inserted={summary.inserted} "
        f"duplicates={summary.skipped_duplicates} failed={summary.failed}"
    )


if __name__ == "__main__":
    main()
