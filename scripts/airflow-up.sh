#!/usr/bin/env bash
set -euo pipefail

docker compose -f infra/docker-compose.yml --profile airflow up -d airflow-init airflow-webserver airflow-scheduler
