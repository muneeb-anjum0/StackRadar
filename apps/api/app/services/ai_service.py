from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.ai.cache import input_hash, recent_report
from app.ai.gemini_provider import GeminiProvider
from app.ai.limits import COOLDOWN_SECONDS, TOKEN_BUDGET_HINT, enforce_gemini_cooldown
from app.ai.mock_provider import MockProvider
from app.ai.prompts import PROMPT_VERSION, build_prompt
from app.ai.provider import AiProviderError, BaseAiProvider
from app.ai.report_builder import build_context
from app.ai.schemas import AiReportOut, AiReportRequest, AiStatusOut, AiUsageOut
from app.core.config import get_settings
from app.models.analytics import AiReport


AVAILABLE_PROVIDERS = ["mock", "gemini"]


def ai_status() -> AiStatusOut:
    settings = get_settings()
    return AiStatusOut(
        default_provider="mock",
        available_providers=AVAILABLE_PROVIDERS,
        gemini_configured=bool(settings.gemini_api_key),
        real_ai_enabled=False,
        gemini_usage_note="Gemini is manual only and uses API quota.",
    )


def _provider(name: str) -> BaseAiProvider:
    settings = get_settings()
    if name == "mock":
        return MockProvider()
    if name == "gemini":
        return GeminiProvider(api_key=settings.gemini_api_key, model=settings.gemini_model)
    raise ValueError("Unsupported AI provider.")


def generate_report(db: Session, report_type: str, payload: AiReportRequest) -> AiReportOut:
    provider_name = payload.provider or "mock"
    if provider_name not in AVAILABLE_PROVIDERS:
        raise ValueError("Unsupported AI provider.")

    current_skills = [skill.strip() for skill in payload.current_skills if skill.strip()]
    context = build_context(db, payload.target_role.strip(), current_skills, payload.weeks)
    digest = input_hash(report_type, provider_name, context)
    cached = recent_report(db, report_type, provider_name, digest)
    if cached:
        cached_output = AiReportOut.model_validate(cached, from_attributes=True)
        cached_output.reused_from_cache = True
        return cached_output

    if provider_name == "gemini":
        enforce_gemini_cooldown(db)

    provider = _provider(provider_name)
    prompt = build_prompt(report_type, context)
    try:
        output = provider.generate(report_type, prompt, context, TOKEN_BUDGET_HINT)
    except AiProviderError:
        raise

    report = AiReport(
        report_type=report_type,
        target_role=context["target_role"],
        current_skills=current_skills,
        provider=provider.name,
        model=provider.model,
        prompt_version=PROMPT_VERSION,
        input_hash=digest,
        input_snapshot=context,
        output_text=output,
        reused_from_cache=False,
        token_budget_hint=TOKEN_BUDGET_HINT,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return AiReportOut.model_validate(report, from_attributes=True)


def list_reports(db: Session, report_type: str | None = None, provider: str | None = None, limit: int = 30) -> list[AiReportOut]:
    statement = select(AiReport)
    if report_type:
        statement = statement.where(AiReport.report_type == report_type)
    if provider:
        statement = statement.where(AiReport.provider == provider)
    rows = db.scalars(statement.order_by(AiReport.created_at.desc()).limit(limit)).all()
    return [AiReportOut.model_validate(row, from_attributes=True) for row in rows]


def get_report(db: Session, report_id: int) -> AiReportOut | None:
    row = db.get(AiReport, report_id)
    return AiReportOut.model_validate(row, from_attributes=True) if row else None


def usage(db: Session) -> AiUsageOut:
    gemini_total = db.scalar(select(func.count()).select_from(AiReport).where(AiReport.provider == "gemini")) or 0
    mock_total = db.scalar(select(func.count()).select_from(AiReport).where(AiReport.provider == "mock")) or 0
    latest_gemini = db.scalar(select(AiReport.created_at).where(AiReport.provider == "gemini").order_by(AiReport.created_at.desc()).limit(1))
    return AiUsageOut(
        gemini_reports_total=gemini_total,
        mock_reports_total=mock_total,
        latest_gemini_report_at=latest_gemini,
        cooldown_seconds=COOLDOWN_SECONDS,
    )
