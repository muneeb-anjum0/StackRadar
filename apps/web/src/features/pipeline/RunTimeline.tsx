import { PipelineRun } from "../../types/api";
import { TimelineShelf } from "../../components/visuals/TimelineShelf";

const runNames: Record<string, string> = {
  live_collect_direct: "Live collection",
  clean_jobs: "Cleaning",
  build_analytics: "Analytics build",
  quality_check: "Data quality check",
  kafka_consume: "Kafka ingestion"
};

export function RunTimeline({ runs }: { runs: PipelineRun[] }) {
  return (
    <TimelineShelf
      items={runs.slice(0, 10).map((run) => ({
        id: run.id,
        title: runNames[run.run_type] ?? run.run_type.replace(/_/g, " "),
        status: run.status,
        meta: `${run.source ?? "all sources"} / ${new Date(run.started_at).toLocaleString()}${run.clean_created > 0 ? ` / ${run.clean_created} usable after cleaning` : ""}`
      }))}
    />
  );
}
