#!/usr/bin/env bash
set -euo pipefail

export PYTHONPATH="apps/api:."
echo "Seeding repeatable demo jobs from pipelines/collectors/sample_jobs.json"
python pipelines/collectors/seed_jobs.py
