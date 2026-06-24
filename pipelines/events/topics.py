from __future__ import annotations

import os


RAW_JOBS_TOPIC = os.getenv("KAFKA_RAW_JOBS_TOPIC", "raw_jobs")
COLLECTOR_EVENTS_TOPIC = os.getenv("KAFKA_COLLECTOR_EVENTS_TOPIC", "collector_events")
FAILED_JOBS_TOPIC = os.getenv("KAFKA_FAILED_JOBS_TOPIC", "failed_jobs")
PIPELINE_EVENTS_TOPIC = os.getenv("KAFKA_PIPELINE_EVENTS_TOPIC", "pipeline_events")

REQUIRED_TOPICS = [RAW_JOBS_TOPIC, COLLECTOR_EVENTS_TOPIC, FAILED_JOBS_TOPIC, PIPELINE_EVENTS_TOPIC]


def bootstrap_servers() -> str:
    return os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
