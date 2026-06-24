# Database

`raw_jobs` stores source data exactly as collected, including messy titles, company variants, free-form salary text and the original JSON payload.

`clean_jobs` stores one normalized row per accepted job. It references `raw_jobs`, includes normalized role/title, parsed location, work mode, seniority, salary fields and a description hash for duplicate detection.

`skills` stores normalized skill names and categories. `job_skills` links clean jobs to extracted skills with confidence and extraction method.

`daily_skill_trends` and `role_skill_summary` are materialized analytics tables for trend and role-skill demand views.

`data_quality_runs` captures quality metrics after each seed/clean run.

`pipeline_runs` records operational history for major scripts: run type, source, status, timestamps, raw inserts, clean rows, duplicate skips, failures and a short message.

`source_health` stores the latest collector health per source, including last attempt, last success, fetched count, inserted count, duplicate skips, failures, last error and clean rate.

`validation_results` stores the latest lightweight validation report. Each row has a check name, pass/fail status, failed count, total count, severity and optional message.
