# Pipeline

StackRadar supports two ingestion modes.

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

Direct mode is the default:

```bash
PYTHONPATH=apps/api:. python pipelines/collectors/live_collect.py --source remotive --limit 500 --mode direct
```

Kafka mode publishes normalized raw-job events to the `raw_jobs` topic:

```bash
PYTHONPATH=apps/api:. python pipelines/collectors/live_collect.py --source remotive --limit 500 --mode kafka
PYTHONPATH=apps/api:. python pipelines/events/consumer.py --topic raw_jobs --max-messages 1000 --timeout-seconds 30
```

The consumer validates required fields, skips duplicate source IDs and records a `kafka_consume` pipeline run.

## Processing Flow

1. Collect or seed jobs into `raw_jobs`.
2. Normalize titles and classify roles.
3. Detect seniority, work mode and basic location.
4. Parse salary text into min, max and currency.
5. Hash descriptions and remove duplicates.
6. Extract skills with a normalized dictionary.
7. Build role-skill summaries and daily skill trend rows.
8. Run data quality checks and store the latest score.
9. Store pipeline runs, source health and validation results for the dashboard.

## Pipeline Runs

Each major script records a `pipeline_runs` row with type, source, status, start/end time, inserted counts, duplicate counts, failure counts and a short message.

Current run types:

- `sample_seed`
- `live_collect_direct`
- `live_collect_kafka`
- `kafka_consume`
- `clean_jobs`
- `build_analytics`
- `quality_check`

The UI translates internal run names into human labels:

- `live_collect_direct` -> Live collection
- `clean_jobs` -> Cleaning
- `build_analytics` -> Analytics build
- `quality_check` -> Data quality check
- `kafka_consume` -> Kafka ingestion

Runs that do not produce clean jobs do not display a misleading `0 clean` metric in the Pipeline lens.

## Source Health

Collectors update `source_health` for `sample`, `remotive`, `adzuna` and Kafka consumer activity. The dashboard shows last success, fetched count, inserted count, failures and clean rate.

## Validation Checks

Quality checks now store a Great Expectations-style report in `validation_results`. Checks cover raw/clean presence, missing titles, missing companies, missing descriptions, salary range order, skill extraction coverage, duplicate rate, clean rate and source freshness.

The Pipeline lens answers three user-facing questions:

1. Is the data fresh?
2. Is it clean?
3. What should not be trusted fully yet?

Noisy classifications are included in the issue pulse when title, role or extracted-skill signals look suspicious.

## Attribution

If Remotive jobs are displayed publicly, preserve the job URL and link back to Remotive/source pages.

## Troubleshooting

- Missing Adzuna keys: set `ADZUNA_APP_ID` and `ADZUNA_APP_KEY`, or run Remotive only.
- API request failed: retry with a smaller `--limit` or a broader `--query`.
- No jobs inserted: the collector likely skipped duplicates already present in `raw_jobs`.
- Need a clean run: use `scripts/reset-db.sh`, start Docker, then seed or collect again.
