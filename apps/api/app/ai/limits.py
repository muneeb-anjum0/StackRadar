from __future__ import annotations

from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models.analytics import AiReport


TOKEN_BUDGET_HINT = 900


def enforce_openrouter_cooldown(db: Session) -> None:
    latest = db.scalar(
        select(AiReport.created_at)
        .where(AiReport.provider == "openrouter", AiReport.reused_from_cache.is_(False))
        .order_by(AiReport.created_at.desc())
        .limit(1)
    )
    cooldown_seconds = get_settings().ai_openrouter_cooldown_seconds
    if latest and latest > datetime.utcnow() - timedelta(seconds=cooldown_seconds):
        remaining = cooldown_seconds - int((datetime.utcnow() - latest).total_seconds())
        raise ValueError(f"OpenRouter cooldown is active. Try again in {max(remaining, 1)} seconds.")
