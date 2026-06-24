from __future__ import annotations

import json
from datetime import datetime
from typing import Any

from pipelines.collectors.base import RawJobRecord


def _iso(value: datetime | None) -> str | None:
    return value.isoformat() if value else None


def raw_job_event(record: RawJobRecord) -> dict[str, Any]:
    return {
        "event_type": "raw_job_collected",
        "source": record.source,
        "source_job_id": record.source_job_id,
        "raw_title": record.raw_title,
        "raw_company": record.raw_company,
        "raw_location": record.raw_location,
        "raw_description": record.raw_description,
        "raw_salary": record.raw_salary,
        "raw_json": record.raw_json,
        "job_url": record.job_url,
        "posted_at": _iso(record.posted_at),
        "collected_at": datetime.utcnow().isoformat(),
    }


def encode_event(event: dict[str, Any]) -> bytes:
    return json.dumps(event, default=str).encode("utf-8")


def decode_event(payload: bytes) -> dict[str, Any]:
    return json.loads(payload.decode("utf-8"))
