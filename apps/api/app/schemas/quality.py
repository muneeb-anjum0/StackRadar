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
