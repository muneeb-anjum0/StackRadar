#!/usr/bin/env bash
set -euo pipefail

export PYTHONPATH="apps/api:."
python pipelines/collectors/seed_jobs.py
