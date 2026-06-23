# Pipeline

1. Load sample jobs into `raw_jobs`.
2. Normalize titles and classify roles.
3. Detect seniority, work mode and basic location.
4. Parse salary text into min, max and currency.
5. Hash descriptions and remove duplicates.
6. Extract skills with a normalized dictionary.
7. Build role-skill summaries and daily skill trend rows.
8. Run data quality checks and store the latest score.

Run locally:

```bash
PYTHONPATH=apps/api:. python pipelines/collectors/seed_jobs.py
```
