#!/usr/bin/env bash
set -euo pipefail

export PYTHONPATH="apps/api:."
TOPIC="${KAFKA_RAW_JOBS_TOPIC:-raw_jobs}"
MAX_MESSAGES="${KAFKA_MAX_MESSAGES:-1000}"
TIMEOUT="${KAFKA_CONSUMER_TIMEOUT_SECONDS:-30}"

python pipelines/events/consumer.py --topic "$TOPIC" --max-messages "$MAX_MESSAGES" --timeout-seconds "$TIMEOUT" "$@"
