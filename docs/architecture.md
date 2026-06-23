# Architecture

StackRadar is a local-first data product with four layers: ingestion, processing, API and dashboard.

The ingestion layer loads `pipelines/collectors/sample_jobs.json` into `raw_jobs` without trying to fix the source data. The processing layer reads raw rows, applies normalization and extraction rules, writes clean records and materializes analytics tables. The API exposes these outputs through focused FastAPI routers. The dashboard consumes the API through TanStack Query.

The shared pipeline matters because the same cleaned intelligence can support many future users. A future SaaS should not run a separate market pipeline for every paid user. Users would subscribe to processed intelligence, saved filters and AI-assisted workflows built on top of common demand data.

Future SaaS additions can include auth, organizations, saved searches, payment webhooks, BYOK AI keys and managed AI calls. Kafka or Airflow can be added later for scheduled ingestion, but the local MVP stays simple and reliable.
