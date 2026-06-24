import { PipelineRun } from "../../types/api";
import { TimelineShelf } from "../../components/visuals/TimelineShelf";

export function RunTimeline({ runs }: { runs: PipelineRun[] }) {
  return (
    <TimelineShelf
      items={runs.slice(0, 10).map((run) => ({
        id: run.id,
        title: run.run_type,
        status: run.status,
        meta: `${run.source ?? "all sources"} / ${new Date(run.started_at).toLocaleString()} / ${run.clean_created} clean`
      }))}
    />
  );
}
