from datetime import date, datetime
from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer, String, Text
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
    started_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime)
    status: Mapped[str] = mapped_column(String(40), default="running")
    message: Mapped[str | None] = mapped_column(Text)
