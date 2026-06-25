from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.ai.cache import input_hash, recent_report
from app.ai.limits import TOKEN_BUDGET_HINT, enforce_openrouter_cooldown
from app.ai.mock_provider import MockProvider
from app.ai.openrouter_provider import OpenRouterProvider
from app.ai.prompts import PROMPT_VERSION, build_prompt
from app.ai.provider import AiProviderError, BaseAiProvider
from app.ai.report_builder import build_context
from app.ai.schemas import AiReportOut, AiReportRequest, AiStatusOut, AiUsageOut
from app.core.config import get_settings
from app.models.analytics import AiReport


AVAILABLE_PROVIDERS = ["mock", "openrouter"]


def ai_status() -> AiStatusOut:
    settings = get_settings()
    return AiStatusOut(
        default_provider="mock",
        available_providers=AVAILABLE_PROVIDERS,
        openrouter_configured=bool(settings.openrouter_api_key),
        real_ai_enabled=bool(settings.openrouter_api_key),
        openrouter_model=settings.openrouter_model,
        usage_note="OpenRouter is manual only and uses API quota/credits.",
    )


def _provider(name: str) -> BaseAiProvider:
    settings = get_settings()
    if name == "mock":
        return MockProvider()
    if name == "openrouter":
        return OpenRouterProvider(
            api_key=settings.openrouter_api_key,
            model=settings.openrouter_model,
            site_url=settings.openrouter_site_url,
            app_name=settings.openrouter_app_name,
        )
    raise ValueError("Unsupported AI provider.")


def generate_report(db: Session, report_type: str, payload: AiReportRequest) -> AiReportOut:
    provider_name = payload.provider or "mock"
    if provider_name not in AVAILABLE_PROVIDERS:
        raise ValueError("Unsupported AI provider.")

    current_skills = [skill.strip() for skill in payload.current_skills if skill.strip()]
    context = build_context(db, payload.target_role.strip(), current_skills, payload.weeks)
    digest = input_hash(report_type, provider_name, {**context, "prompt_version": PROMPT_VERSION})
    cached = recent_report(db, report_type, provider_name, digest)
    if cached:
        cached_output = AiReportOut.model_validate(cached, from_attributes=True)
        cached_output.reused_from_cache = True
        return cached_output

    if provider_name == "openrouter":
        enforce_openrouter_cooldown(db)

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
    settings = get_settings()
    openrouter_total = db.scalar(select(func.count()).select_from(AiReport).where(AiReport.provider == "openrouter")) or 0
    mock_total = db.scalar(select(func.count()).select_from(AiReport).where(AiReport.provider == "mock")) or 0
    latest_openrouter = db.scalar(select(AiReport.created_at).where(AiReport.provider == "openrouter").order_by(AiReport.created_at.desc()).limit(1))
    return AiUsageOut(
        openrouter_reports_total=openrouter_total,
        mock_reports_total=mock_total,
        latest_openrouter_report_at=latest_openrouter,
        cooldown_seconds=settings.ai_openrouter_cooldown_seconds,
    )
