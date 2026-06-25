from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator


AiProvider = Literal["mock", "openrouter"]
ReportType = Literal["career_report", "learning_roadmap", "role_fit", "project_suggestions", "skill_gap_brief", "job_quality"]


class AiReportRequest(BaseModel):
    target_role: str = Field(min_length=2, max_length=120)
    current_skills: list[str] = Field(default_factory=list)
    provider: AiProvider = "mock"
    weeks: int = Field(default=4, ge=1, le=8)


class AiStatusOut(BaseModel):
    default_provider: AiProvider
    available_providers: list[AiProvider]
    openrouter_configured: bool
    real_ai_enabled: bool
    openrouter_model: str
    usage_note: str


class AiReportOut(BaseModel):
    id: int
    report_type: ReportType
    target_role: str
    current_skills: list[str]
    provider: str
    model: str | None
    prompt_version: str
    input_snapshot: dict
    output_text: str
    created_at: datetime
    reused_from_cache: bool
    token_budget_hint: int

    @field_validator("provider", mode="before")
    @classmethod
    def map_legacy_provider(cls, value: object) -> object:
        return "legacy" if value == "gemini" else value


class AiUsageOut(BaseModel):
    openrouter_reports_total: int
    mock_reports_total: int
    latest_openrouter_report_at: datetime | None
    cooldown_seconds: int
