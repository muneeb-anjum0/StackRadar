# Architecture

StackRadar is a local-first data product with five layers: ingestion, optional event flow, processing, API and dashboard.

The ingestion layer loads `pipelines/collectors/sample_jobs.json` or live API data without trying to fix the source data. In simple mode, collectors write straight to `raw_jobs`. In event mode, collectors publish normalized raw events to Kafka and the consumer writes them to `raw_jobs`. The processing layer reads raw rows, applies normalization and extraction rules, writes clean records and materializes analytics tables. The API exposes these outputs through focused FastAPI routers. The dashboard consumes the API through TanStack Query.

The shared pipeline matters because the same cleaned intelligence can support many future users. A future SaaS should not run a separate market pipeline for every paid user. Users would subscribe to processed intelligence, saved filters and AI-assisted workflows built on top of common demand data.

Airflow is available as an optional local orchestration profile. It runs the same collector, consumer, cleaner, analytics and quality modules used by the scripts, so the portfolio-grade path does not fork the business logic.

Future SaaS additions can include auth, organizations, saved searches, payment webhooks, BYOK AI keys, managed AI calls and hosted schedulers.
