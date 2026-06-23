from datetime import datetime
from pydantic import BaseModel, ConfigDict


class SkillOut(BaseModel):
    id: int
    name: str
    category: str

    model_config = ConfigDict(from_attributes=True)


class JobOut(BaseModel):
    id: int
    normalized_title: str
    normalized_role: str
    company: str | None
    city: str | None
    country: str | None
    work_mode: str
    seniority: str
    salary_min: float | None
    salary_max: float | None
    currency: str | None
    job_url: str | None
    created_at: datetime
    skills: list[SkillOut]


class JobDetail(JobOut):
    raw_description: str | None


class JobSearchResponse(BaseModel):
    total: int
    jobs: list[JobOut]
