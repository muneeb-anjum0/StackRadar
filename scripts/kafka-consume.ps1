$env:PYTHONPATH = "apps/api;."
$topic = if ($env:KAFKA_RAW_JOBS_TOPIC) { $env:KAFKA_RAW_JOBS_TOPIC } else { "raw_jobs" }
$maxMessages = if ($env:KAFKA_MAX_MESSAGES) { $env:KAFKA_MAX_MESSAGES } else { "1000" }
$timeout = if ($env:KAFKA_CONSUMER_TIMEOUT_SECONDS) { $env:KAFKA_CONSUMER_TIMEOUT_SECONDS } else { "30" }

python pipelines/events/consumer.py --topic $topic --max-messages $maxMessages --timeout-seconds $timeout @args
