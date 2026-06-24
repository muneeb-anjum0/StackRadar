from datetime import datetime
from pydantic import BaseModel


class QualitySummary(BaseModel):
    run_at: datetime | None
    total_raw_jobs: int
    total_clean_jobs: int
    duplicate_count: int
    missing_title_count: int
    missing_company_count: int
    missing_description_count: int
    missing_salary_count: int
    invalid_salary_count: int
    jobs_without_skills_count: int
    quality_score: float


class QualityIssue(BaseModel):
    severity: str
    title: str
    description: str
    count: int


class PipelineRunOut(BaseModel):
    id: int
    run_type: str
    source: str | None
    started_at: datetime
    finished_at: datetime | None
    status: str
    raw_inserted: int
    clean_created: int
    duplicates_skipped: int
    failed_count: int
    message: str | None


class SourceHealthOut(BaseModel):
    source: str
    status: str
    last_attempt_at: datetime | None
    last_success_at: datetime | None
    fetched_count: int
    inserted_count: int
    skipped_duplicates: int
    failed_count: int
    clean_rate: float
    last_error: str | None


class ValidationCheckOut(BaseModel):
    check_name: str
    status: str
    failed_count: int
    total_count: int
    severity: str
    message: str | None
