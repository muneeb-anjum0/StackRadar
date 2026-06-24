# Data Quality

StackRadar tracks data quality as pipeline evidence, not just as a score.

Tables:

- `data_quality_runs`: summary counts and quality score.
- `pipeline_runs`: script and orchestration history.
- `source_health`: latest health per collector/source.
- `validation_results`: named validation checks from the latest run.

Validation checks:

- raw jobs exist
- clean jobs exist
- title is present
- company is present
- description is present
- salary min does not exceed salary max
- clean jobs have extracted skills
- duplicate rate stays below threshold
- clean rate is acceptable
- sources are fresh

API:

```bash
curl http://localhost:8000/quality/summary
curl http://localhost:8000/quality/pipeline-runs
curl http://localhost:8000/quality/source-health
curl http://localhost:8000/quality/validations
```

The Data Quality page uses these endpoints for pipeline status, source health, validation checks and run history.
