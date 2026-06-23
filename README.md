# StackRadar

StackRadar is a local-first job-market intelligence platform for students, junior developers, career switchers and career coaches. It collects messy job posts, stores raw data, cleans and normalizes it, extracts skills, builds analytics and displays the results in a polished React dashboard.

This version is a portfolio-grade local data platform, not a live SaaS. The structure is intentionally clean so users, paid plans, BYOK AI features and managed plans can be added later without rewriting the core pipeline.

## Why It Matters

Early-career candidates often guess which skills matter. StackRadar turns job posts into evidence: demanded skills, role patterns, salary coverage, remote availability and data quality signals.

## Features

- FastAPI backend with SQLAlchemy and Pydantic schemas
- PostgreSQL storage for raw jobs, clean jobs, skills, analytics and quality runs
- Messy sample dataset with 105 realistic postings
- Cleaning pipeline for titles, roles, seniority, work mode, location and salary
- Dictionary-based skill extraction with normalized aliases
- Duplicate detection using source IDs and content fingerprints
- Analytics endpoints for overview, skills, roles, trends and skill gaps
- Dark SaaS-style React dashboard with Tailwind, Recharts, Framer Motion and TanStack Query
- Docker Compose local setup with Postgres, Redis, API and web app

## Architecture

```mermaid
flowchart LR
  A["sample_jobs.json"] --> B["Raw job loader"]
  B --> C[("raw_jobs")]
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
  J --> K["React dashboard"]
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

Seed data after Postgres is running:

```bash
bash scripts/seed.sh
```

Windows PowerShell equivalent:

```powershell
.\scripts\seed.ps1
```

Open:

- Dashboard: http://localhost:5173
- API: http://localhost:8000
- API docs: http://localhost:8000/docs
- PostgreSQL: localhost:5432

Reset the database volume:

```bash
bash scripts/reset-db.sh
```

PowerShell:

```powershell
.\scripts\reset-db.ps1
```

## Folder Structure

The repository follows the requested `apps`, `pipelines`, `infra`, `docs` and `scripts` layout. The only improvement is keeping reusable frontend primitives under `components/ui` and business pages under `pages`, which keeps UI files small and easier to scan.

## API Endpoints

- `GET /health`
- `GET /jobs`
- `GET /jobs/{job_id}`
- `GET /jobs/search?query=&role=&skill=&work_mode=&seniority=`
- `GET /analytics/overview`
- `GET /analytics/top-skills`
- `GET /analytics/top-roles`
- `GET /analytics/work-modes`
- `GET /analytics/seniority`
- `GET /analytics/role/{role}`
- `GET /analytics/skill-trends`
- `POST /analytics/skill-gap`
- `GET /quality/summary`
- `GET /quality/issues`

## Dashboard Pages

- Market Overview
- Skills Intelligence
- Role Analyzer
- Skill Gap Checker
- Data Quality Monitor
- Jobs Explorer

## Cleaning Rules

StackRadar normalizes role titles, detects seniority and work mode from titles/descriptions, parses basic city/country values, parses common PKR/USD salary formats, extracts skills through aliases and removes duplicates before analytics are built.

## Screenshots

Add screenshots here after running the local dashboard:

- Overview dashboard
- Role analyzer
- Skill gap checker
- Jobs explorer

## Future Roadmap

- Authentication and saved workspaces
- User-uploaded job datasets
- AI-assisted extraction with BYOK keys
- Managed AI plan using platform keys
- Payment webhooks and subscriptions
- Background jobs for scheduled refreshes
- Kafka or Airflow only after the local core remains stable

## SaaS Plan Idea

Free users can inspect limited processed intelligence. BYOK users provide their own AI key for enhanced extraction. Managed users use platform-managed AI capacity. Paid users access processed intelligence, not separate pipeline forks.

## What This Project Proves

StackRadar demonstrates data collection, raw storage, cleaning, processing, skill extraction, role normalization, salary parsing, duplicate detection, data quality monitoring, analytics, a backend API, a modern dashboard and local Docker-based delivery.
