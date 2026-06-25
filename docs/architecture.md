# Architecture

StackRadar is a local-first data product with six layers: ingestion, optional event flow, processing, AI interpretation, API and dashboard.

The ingestion layer loads `pipelines/collectors/sample_jobs.json` or live API data without trying to fix the source data. In simple mode, collectors write straight to `raw_jobs`. In event mode, collectors publish normalized raw events to Kafka and the consumer writes them to `raw_jobs`. The processing layer reads raw rows, applies normalization and extraction rules, writes clean records and materializes analytics tables. The AI layer sits on top of those deterministic analytics; it never replaces them. The API exposes these outputs through focused FastAPI routers. The dashboard consumes the API through TanStack Query.

The shared pipeline matters because the same cleaned intelligence can support many future users. A future SaaS should not run a separate market pipeline for every paid user. Users would subscribe to processed intelligence, saved filters and AI-assisted workflows built on top of common demand data.

Airflow is available as an optional local orchestration profile. It runs the same collector, consumer, cleaner, analytics and quality modules used by the scripts, so the portfolio-grade path does not fork the business logic.

AI career reports are manual backend actions. Mock mode is default and works without keys. OpenRouter mode is opt-in, uses backend environment variables only, and receives compact analytics summaries rather than raw job dumps. The Career Plan flow keeps deterministic fit analysis separate from manual AI briefs, roadmaps and project plans.

Future SaaS additions can include auth, organizations, saved searches, payment webhooks, BYOK AI keys, managed AI calls and hosted schedulers.
