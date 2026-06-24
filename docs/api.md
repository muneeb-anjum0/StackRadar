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

Key routes are grouped under `/jobs`, `/analytics` and `/quality`. Interactive documentation is available at `http://localhost:8000/docs` when the API is running.
