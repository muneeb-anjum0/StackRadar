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

export type Skill = { id: number; name: string; category: string };

export type Job = {
  id: number;
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

export type SkillGap = {
  target_role: string;
  match_percentage: number;
  matched_skills: string[];
  missing_skills: string[];
  recommended_next_skills: string[];
  summary: string;
};
