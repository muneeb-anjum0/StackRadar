# StackRadar Pipelines

The local pipeline loads intentionally messy sample jobs into `raw_jobs`, cleans them into `clean_jobs`, extracts skills, removes duplicates, scores data quality and builds analytics tables.

Run from the repository root:

```bash
PYTHONPATH=apps/api:. python pipelines/collectors/seed_jobs.py
```
