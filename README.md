# StackRadar

StackRadar is a local-first job-market intelligence platform for students, junior developers, career switchers and career coaches. It collects messy job posts, stores raw data, cleans and normalizes it, extracts skills, builds analytics and displays the results in a polished React dashboard.

This version is a portfolio-grade local data platform, not a live SaaS. The structure is intentionally clean so users, paid plans, BYOK AI features and managed plans can be added later without rewriting the core pipeline.

## Why It Matters

Early-career candidates often guess which skills matter. StackRadar turns job posts into evidence: demanded skills, role patterns, salary coverage, remote availability and data quality signals.

## Features

- FastAPI backend with SQLAlchemy and Pydantic schemas
- PostgreSQL storage for raw jobs, clean jobs, skills, analytics and quality runs
- Optional Kafka event ingestion for raw job events
- Optional Airflow DAG for local orchestration
- Manual AI career intelligence with Mock and Gemini providers
- Messy sample dataset with 105 realistic postings
- Live API collectors for Remotive and Adzuna
- Cleaning pipeline for titles, roles, seniority, work mode, location and salary
- Dictionary-based skill extraction with normalized aliases
- Duplicate detection using source IDs and content fingerprints
- Analytics endpoints for overview, skills, roles, trends and skill gaps
- Career intelligence workspace with source freshness, source filters and API-backed analytics
- Docker Compose local setup with Postgres, Redis, Kafka, API and web app

## Architecture

```mermaid
flowchart LR
  A["sample_jobs.json / live APIs"] --> B["Raw job loader"]
  B --> C[("raw_jobs")]
  B -. "Kafka mode" .-> T[("raw_jobs topic")]
  T -. "consumer" .-> C
  C --> D["Cleaning pipeline"]
  D --> E[("clean_jobs")]
  D --> F[("skills + job_skills")]
  E --> G["Analytics builder"]
  F --> G
  G --> H[("analytics tables")]
  D --> I[("data_quality_runs")]
  H --> J["FastAPI"]
  E --> J
  I --> J
  J --> R["React dashboard"]
  J --> AI["AI career reports"]
```

## Tech Stack

Frontend: React, TypeScript, Vite, Tailwind CSS, Recharts, Framer Motion, TanStack Query, Lucide React.

Backend: Python, FastAPI, SQLAlchemy, Pydantic, PostgreSQL, Uvicorn.

Data: Python, Pandas-ready environment, regex cleaning, dictionary skill extraction.

Infrastructure: Docker, Docker Compose, PostgreSQL, optional Redis.

## Local Setup

Start services from the repository root:

```bash
docker compose -f infra/docker-compose.yml up --build
```

Seed repeatable demo data after Postgres is running:

```bash
bash scripts/seed.sh
```

Windows PowerShell equivalent:

```powershell
.\scripts\seed.ps1
```

Collect live API data:

```bash
bash scripts/collect-live.sh
```

PowerShell:

```powershell
.\scripts\collect-live.ps1
```

By default this fetches Remotive and Adzuna. Remotive needs no key. Adzuna is skipped unless `ADZUNA_APP_ID` and `ADZUNA_APP_KEY` are set.

Kafka demo mode publishes events first, then consumes them into Postgres:

```bash
bash scripts/collect-live.sh --mode kafka
bash scripts/kafka-consume.sh
```

Airflow is optional and runs behind a Docker Compose profile:

```bash
bash scripts/airflow-up.sh
```

PowerShell:

```powershell
.\scripts\airflow-up.ps1
```

Open:

- Dashboard: http://localhost:5173
- API: http://localhost:8000
- API docs: http://localhost:8000/docs
- Airflow, when enabled: http://localhost:8080
- PostgreSQL: localhost:5432

Reset the database volume:

```bash
bash scripts/reset-db.sh
```

PowerShell:

```powershell
.\scripts\reset-db.ps1
```

## Cleaning Rules

StackRadar normalizes role titles, detects seniority and work mode from titles/descriptions, parses basic city/country values, parses common salary formats, extracts skills through aliases and removes duplicates before analytics are built.

