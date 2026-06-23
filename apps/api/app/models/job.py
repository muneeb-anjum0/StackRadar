from datetime import datetime
from sqlalchemy import DateTime, Float, ForeignKey, Integer, JSON, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base


class RawJob(Base):
    __tablename__ = "raw_jobs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    source: Mapped[str] = mapped_column(String(80), index=True)
    source_job_id: Mapped[str | None] = mapped_column(String(120), index=True)
    raw_title: Mapped[str | None] = mapped_column(String(255))
    raw_company: Mapped[str | None] = mapped_column(String(255))
    raw_location: Mapped[str | None] = mapped_column(String(255))
    raw_description: Mapped[str | None] = mapped_column(Text)
    raw_salary: Mapped[str | None] = mapped_column(String(120))
    raw_json: Mapped[dict | None] = mapped_column(JSON)
    collected_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    clean_job: Mapped["CleanJob"] = relationship(back_populates="raw_job", uselist=False)


class CleanJob(Base):
    __tablename__ = "clean_jobs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    raw_job_id: Mapped[int] = mapped_column(ForeignKey("raw_jobs.id"), unique=True)
    normalized_title: Mapped[str] = mapped_column(String(255), index=True)
    normalized_role: Mapped[str] = mapped_column(String(120), index=True)
    company: Mapped[str | None] = mapped_column(String(255), index=True)
    city: Mapped[str | None] = mapped_column(String(120))
    country: Mapped[str | None] = mapped_column(String(120))
    work_mode: Mapped[str] = mapped_column(String(40), index=True)
    seniority: Mapped[str] = mapped_column(String(60), index=True)
    salary_min: Mapped[float | None] = mapped_column(Float)
    salary_max: Mapped[float | None] = mapped_column(Float)
    currency: Mapped[str | None] = mapped_column(String(12))
    posted_at: Mapped[datetime | None] = mapped_column(DateTime)
    job_url: Mapped[str | None] = mapped_column(String(500))
    description_hash: Mapped[str] = mapped_column(String(64), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    raw_job: Mapped[RawJob] = relationship(back_populates="clean_job")
    skills: Mapped[list["JobSkill"]] = relationship(back_populates="job", cascade="all, delete-orphan")

    __table_args__ = (
        UniqueConstraint("company", "normalized_title", "city", "description_hash", name="uq_clean_job_fingerprint"),
    )
