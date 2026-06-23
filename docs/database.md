# Database

`raw_jobs` stores source data exactly as collected, including messy titles, company variants, free-form salary text and the original JSON payload.

`clean_jobs` stores one normalized row per accepted job. It references `raw_jobs`, includes normalized role/title, parsed location, work mode, seniority, salary fields and a description hash for duplicate detection.

`skills` stores normalized skill names and categories. `job_skills` links clean jobs to extracted skills with confidence and extraction method.

`daily_skill_trends` and `role_skill_summary` are materialized analytics tables for trend and role-skill demand views.

`data_quality_runs` captures quality metrics after each seed/clean run. `pipeline_runs` is reserved for future run tracking and scheduler integration.
