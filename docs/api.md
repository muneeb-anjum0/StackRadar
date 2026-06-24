# API

Example overview response:

```json
{
  "total_jobs": 102,
  "total_companies": 10,
  "total_skills": 30,
  "most_common_role": "Backend Developer",
  "most_demanded_skill": "Python",
  "remote_job_percentage": 18.6,
  "average_salary": 128000,
  "data_quality_score": 81.2
}
```

Skill gap request:

```json
{
  "target_role": "Backend Developer",
  "current_skills": ["React", "Node.js", "MongoDB"]
}
```

Quality observability routes:

- `GET /quality/pipeline-runs` returns the latest 20 operational runs.
- `GET /quality/source-health` returns collector health by source.
- `GET /quality/validations` returns the latest validation report.

AI career intelligence routes:

- `GET /ai/status` returns provider availability and Gemini configuration state.
- `POST /ai/career-report` generates or reuses a grounded career report.
- `POST /ai/learning-roadmap` generates or reuses a 4-week roadmap.
- `POST /ai/project-suggestions` generates or reuses portfolio project ideas.
- `POST /ai/role-fit` explains fit for a target role.
- `POST /ai/skill-gap-brief` creates a concise gap brief.
- `POST /ai/job-quality` explains dataset quality for a role.
- `GET /ai/reports` returns latest generated reports.
- `GET /ai/reports/{report_id}` returns one full report.
- `GET /ai/usage` returns Mock/Gemini report counts and cooldown seconds.

AI requests use existing StackRadar analytics as structured context. API keys are never sent to the frontend.

Key routes are grouped under `/jobs`, `/analytics`, `/quality` and `/ai`. Interactive documentation is available at `http://localhost:8000/docs` when the API is running.
