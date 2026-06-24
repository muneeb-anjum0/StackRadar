export type CountItem = { name: string; count: number; percentage: number };

export type Overview = {
  total_jobs: number;
  total_companies: number;
  total_skills: number;
  most_common_role: string | null;
  most_demanded_skill: string | null;
  remote_job_percentage: number;
  average_salary: number | null;
  data_quality_score: number;
};

export type SourceItem = {
  source: string;
  raw_jobs: number;
  clean_jobs: number;
  last_collected_at: string | null;
  missing_salary_count: number;
};

export type SourceSummary = {
  total_sources: number;
  total_raw_jobs: number;
  total_clean_jobs: number;
  last_collected_at: string | null;
  mode: string;
  sources: SourceItem[];
};

export type Skill = { id: number; name: string; category: string };

export type Job = {
  id: number;
  source: string;
  normalized_title: string;
  normalized_role: string;
  company: string | null;
  city: string | null;
  country: string | null;
  work_mode: string;
  seniority: string;
  salary_min: number | null;
  salary_max: number | null;
  currency: string | null;
  posted_at: string | null;
  collected_at: string | null;
  job_url: string | null;
  created_at: string;
  skills: Skill[];
};

export type JobResponse = { total: number; jobs: Job[] };

export type RoleAnalytics = {
  role: string;
  total_jobs: number;
  top_skills: CountItem[];
  common_work_modes: CountItem[];
  salary_min: number | null;
  salary_max: number | null;
  seniority_distribution: CountItem[];
  top_companies: CountItem[];
};

export type QualitySummary = {
  run_at: string | null;
  total_raw_jobs: number;
  total_clean_jobs: number;
  duplicate_count: number;
  missing_title_count: number;
  missing_company_count: number;
  missing_description_count: number;
  missing_salary_count: number;
  invalid_salary_count: number;
  jobs_without_skills_count: number;
  quality_score: number;
};

export type QualityIssue = { severity: string; title: string; description: string; count: number };

export type PipelineRun = {
  id: number;
  run_type: string;
  source: string | null;
  started_at: string;
  finished_at: string | null;
  status: string;
  raw_inserted: number;
  clean_created: number;
  duplicates_skipped: number;
  failed_count: number;
  message: string | null;
};

export type SourceHealth = {
  source: string;
  status: string;
  last_attempt_at: string | null;
  last_success_at: string | null;
  fetched_count: number;
  inserted_count: number;
  skipped_duplicates: number;
  failed_count: number;
  clean_rate: number;
  last_error: string | null;
};

export type ValidationCheck = {
  check_name: string;
  status: string;
  failed_count: number;
  total_count: number;
  severity: string;
  message: string | null;
};

export type SkillGap = {
  target_role: string;
  match_percentage: number;
  matched_skills: string[];
  missing_skills: string[];
  recommended_next_skills: string[];
  summary: string;
};
