# Kafka

Kafka is optional. Direct database ingestion remains the default path.

Start the local stack:

```bash
docker compose -f infra/docker-compose.yml up --build
```

Create topics when needed:

```bash
bash scripts/kafka-topics.sh
```

PowerShell:

```powershell
.\scripts\kafka-topics.ps1
```

Publish live jobs as events:

```bash
bash scripts/collect-live.sh --mode kafka
```

Consume events into Postgres:

```bash
bash scripts/kafka-consume.sh
```

Topics:

- `raw_jobs`
- `collector_events`
- `failed_jobs`
- `pipeline_events`

If Kafka is down, use `PIPELINE_MODE=direct` or omit `--mode kafka`.
