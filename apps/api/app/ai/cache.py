from __future__ import annotations

import hashlib
import json
from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.analytics import AiReport


CACHE_HOURS = 24


def input_hash(report_type: str, provider: str, context: dict) -> str:
    payload = json.dumps({"report_type": report_type, "provider": provider, "context": context}, sort_keys=True, default=str)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def recent_report(db: Session, report_type: str, provider: str, digest: str) -> AiReport | None:
    cutoff = datetime.utcnow() - timedelta(hours=CACHE_HOURS)
    return db.scalar(
        select(AiReport)
        .where(
            AiReport.report_type == report_type,
            AiReport.provider == provider,
            AiReport.input_hash == digest,
            AiReport.created_at >= cutoff,
        )
        .order_by(AiReport.created_at.desc())
        .limit(1)
    )
