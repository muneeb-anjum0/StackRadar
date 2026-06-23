from pydantic import BaseModel


class CountItem(BaseModel):
    name: str
    count: int
    percentage: float


class OverviewOut(BaseModel):
    total_jobs: int
    total_companies: int
    total_skills: int
    most_common_role: str | None
    most_demanded_skill: str | None
    remote_job_percentage: float
    average_salary: float | None
    data_quality_score: float


class RoleAnalyticsOut(BaseModel):
    role: str
    total_jobs: int
    top_skills: list[CountItem]
    common_work_modes: list[CountItem]
    salary_min: float | None
    salary_max: float | None
    seniority_distribution: list[CountItem]
    top_companies: list[CountItem]


class SkillTrendOut(BaseModel):
    date: str
    skill: str
    role: str | None
    location: str | None
    job_count: int


class SourceItem(BaseModel):
    source: str
    raw_jobs: int
    clean_jobs: int
    last_collected_at: str | None
    missing_salary_count: int


class SourceSummaryOut(BaseModel):
    total_sources: int
    total_raw_jobs: int
    total_clean_jobs: int
    last_collected_at: str | None
    mode: str
    sources: list[SourceItem]


class SkillGapRequest(BaseModel):
    target_role: str
    current_skills: list[str]


class SkillGapResponse(BaseModel):
    target_role: str
    match_percentage: float
    matched_skills: list[str]
    missing_skills: list[str]
    recommended_next_skills: list[str]
    summary: str
