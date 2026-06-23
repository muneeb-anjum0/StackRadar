# Pipeline

StackRadar now supports two ingestion modes.

## Demo Seed

`pipelines/collectors/sample_jobs.json` is the repeatable demo dataset. Use it when you want predictable portfolio data.

```bash
PYTHONPATH=apps/api:. python pipelines/collectors/seed_jobs.py
```

This resets local tables, loads demo jobs as source `sample`, cleans the data, rebuilds analytics and stores a quality run.

## Live Collection

Live collectors fetch external API data into `raw_jobs` and then reuse the same cleaning/analytics pipeline.

Sources:

- Remotive API: no key required, stored as `remotive`.
- Adzuna API: requires `ADZUNA_APP_ID` and `ADZUNA_APP_KEY`, stored as `adzuna`.

Run:

```bash
PYTHONPATH=apps/api:. python pipelines/collectors/live_collect.py --source all --limit 1000 --query "software developer" --country gb
```

Adzuna is skipped gracefully when keys are missing. Remotive still runs.

## Processing Flow

1. Collect or seed jobs into `raw_jobs`.
2. Normalize titles and classify roles.
3. Detect seniority, work mode and basic location.
4. Parse salary text into min, max and currency.
5. Hash descriptions and remove duplicates.
6. Extract skills with a normalized dictionary.
7. Build role-skill summaries and daily skill trend rows.
8. Run data quality checks and store the latest score.

## Attribution

If Remotive jobs are displayed publicly, preserve the job URL and link back to Remotive/source pages.

## Troubleshooting

- Missing Adzuna keys: set `ADZUNA_APP_ID` and `ADZUNA_APP_KEY`, or run Remotive only.
- API request failed: retry with a smaller `--limit` or a broader `--query`.
- No jobs inserted: the collector likely skipped duplicates already present in `raw_jobs`.
- Need a clean run: use `scripts/reset-db.sh`, start Docker, then seed or collect again.
