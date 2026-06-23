#!/usr/bin/env bash
set -euo pipefail

export PYTHONPATH="apps/api:."
QUERY="${DEFAULT_JOB_QUERY:-software developer}"
LIMIT="${LIVE_COLLECT_LIMIT:-1000}"
COUNTRY="${ADZUNA_COUNTRY:-gb}"

python pipelines/collectors/live_collect.py --source all --limit "$LIMIT" --query "$QUERY" --country "$COUNTRY"
