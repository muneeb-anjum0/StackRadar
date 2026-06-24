#!/usr/bin/env bash
set -euo pipefail

docker compose -f infra/docker-compose.yml exec kafka /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server kafka:9092 \
  --create --if-not-exists --topic raw_jobs --partitions 1 --replication-factor 1
docker compose -f infra/docker-compose.yml exec kafka /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server kafka:9092 \
  --create --if-not-exists --topic collector_events --partitions 1 --replication-factor 1
docker compose -f infra/docker-compose.yml exec kafka /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server kafka:9092 \
  --create --if-not-exists --topic failed_jobs --partitions 1 --replication-factor 1
docker compose -f infra/docker-compose.yml exec kafka /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server kafka:9092 \
  --create --if-not-exists --topic pipeline_events --partitions 1 --replication-factor 1
