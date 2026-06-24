from __future__ import annotations

from dataclasses import dataclass

from pipelines.collectors.base import RawJobRecord
from pipelines.events.serializers import encode_event, raw_job_event
from pipelines.events.topics import RAW_JOBS_TOPIC, bootstrap_servers


@dataclass
class PublishSummary:
    topic: str
    published: int = 0
    failed: int = 0


def publish_raw_jobs(records: list[RawJobRecord], topic: str = RAW_JOBS_TOPIC) -> PublishSummary:
    try:
        from kafka import KafkaProducer
    except ImportError as exc:
        raise RuntimeError("Kafka mode requires the kafka-python package. Install backend requirements first.") from exc

    summary = PublishSummary(topic=topic)
    producer = KafkaProducer(bootstrap_servers=bootstrap_servers(), value_serializer=encode_event)
    try:
        for record in records:
            event = raw_job_event(record)
            try:
                producer.send(topic, value=event, key=(record.source_job_id or record.source).encode("utf-8"))
                summary.published += 1
            except Exception:
                summary.failed += 1
        producer.flush()
    finally:
        producer.close()
    return summary
