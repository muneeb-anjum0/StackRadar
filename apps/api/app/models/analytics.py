from datetime import date, datetime
from sqlalchemy import Boolean, Date, DateTime, Float, ForeignKey, Index, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


class DailySkillTrend(Base):
    __tablename__ = "daily_skill_trends"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    date: Mapped[date] = mapped_column(Date, index=True)
    skill_id: Mapped[int] = mapped_column(ForeignKey("skills.id"), index=True)
    role: Mapped[str | None] = mapped_column(String(120), index=True)
    location: Mapped[str | None] = mapped_column(String(160))
    job_count: Mapped[int] = mapped_column(Integer, default=0)


class RoleSkillSummary(Base):
    __tablename__ = "role_skill_summary"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    role: Mapped[str] = mapped_column(String(120), index=True)
    skill_id: Mapped[int] = mapped_column(ForeignKey("skills.id"), index=True)
    total_jobs: Mapped[int] = mapped_column(Integer, default=0)
    demand_percentage: Mapped[float] = mapped_column(Float, default=0)


class DataQualityRun(Base):
    __tablename__ = "data_quality_runs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    run_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    total_raw_jobs: Mapped[int] = mapped_column(Integer, default=0)
    total_clean_jobs: Mapped[int] = mapped_column(Integer, default=0)
    duplicate_count: Mapped[int] = mapped_column(Integer, default=0)
    missing_title_count: Mapped[int] = mapped_column(Integer, default=0)
    missing_company_count: Mapped[int] = mapped_column(Integer, default=0)
    missing_description_count: Mapped[int] = mapped_column(Integer, default=0)
    missing_salary_count: Mapped[int] = mapped_column(Integer, default=0)
    invalid_salary_count: Mapped[int] = mapped_column(Integer, default=0)
    jobs_without_skills_count: Mapped[int] = mapped_column(Integer, default=0)
    quality_score: Mapped[float] = mapped_column(Float, default=0)


class PipelineRun(Base):
    __tablename__ = "pipeline_runs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    run_type: Mapped[str] = mapped_column(String(80), default="manual", index=True)
    source: Mapped[str | None] = mapped_column(String(80), index=True)
    started_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime)
    status: Mapped[str] = mapped_column(String(40), default="running")
    raw_inserted: Mapped[int] = mapped_column(Integer, default=0)
    clean_created: Mapped[int] = mapped_column(Integer, default=0)
    duplicates_skipped: Mapped[int] = mapped_column(Integer, default=0)
    failed_count: Mapped[int] = mapped_column(Integer, default=0)
    message: Mapped[str | None] = mapped_column(Text)


class SourceHealth(Base):
    __tablename__ = "source_health"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    source: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    last_attempt_at: Mapped[datetime | None] = mapped_column(DateTime)
    last_success_at: Mapped[datetime | None] = mapped_column(DateTime)
    status: Mapped[str] = mapped_column(String(40), default="unknown")
    fetched_count: Mapped[int] = mapped_column(Integer, default=0)
    inserted_count: Mapped[int] = mapped_column(Integer, default=0)
    skipped_duplicates: Mapped[int] = mapped_column(Integer, default=0)
    failed_count: Mapped[int] = mapped_column(Integer, default=0)
    last_error: Mapped[str | None] = mapped_column(Text)
    avg_clean_rate: Mapped[float] = mapped_column(Float, default=0)


class ValidationResult(Base):
    __tablename__ = "validation_results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    run_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    check_name: Mapped[str] = mapped_column(String(120), index=True)
    status: Mapped[str] = mapped_column(String(40), index=True)
    failed_count: Mapped[int] = mapped_column(Integer, default=0)
    total_count: Mapped[int] = mapped_column(Integer, default=0)
    severity: Mapped[str] = mapped_column(String(40), default="medium")
    message: Mapped[str | None] = mapped_column(Text)


class AiReport(Base):
    __tablename__ = "ai_reports"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    report_type: Mapped[str] = mapped_column(String(80), index=True)
    target_role: Mapped[str] = mapped_column(String(120), index=True)
    current_skills: Mapped[list[str]] = mapped_column(JSON)
    provider: Mapped[str] = mapped_column(String(40), index=True)
    model: Mapped[str | None] = mapped_column(String(120))
    prompt_version: Mapped[str] = mapped_column(String(40), default="v1")
    input_hash: Mapped[str] = mapped_column(String(64), index=True)
    input_snapshot: Mapped[dict] = mapped_column(JSON)
    output_text: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    reused_from_cache: Mapped[bool] = mapped_column(Boolean, default=False)
    token_budget_hint: Mapped[int] = mapped_column(Integer, default=900)

    __table_args__ = (
        Index("ix_ai_reports_lookup", "report_type", "target_role", "provider", "input_hash", "created_at"),
    )
