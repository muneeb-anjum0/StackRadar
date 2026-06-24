import { LensHeader } from "../../components/shell/LensHeader";
import { Surface } from "../../components/primitives/Surface";
import { LoadingPanel } from "../../components/primitives/LoadingPanel";
import { ProgressLine } from "../../components/primitives/ProgressLine";
import { usePipelineData } from "../../hooks/usePipelineData";
import { RunTimeline } from "./RunTimeline";
import { SourceHealthLedger } from "./SourceHealthLedger";
import { ValidationStack } from "./ValidationStack";

export function PipelineLens() {
  const { summary, issues, sources, pipelineRuns, sourceHealth, validations } = usePipelineData();
  const data = summary.data;
  if (summary.isLoading) return <LoadingPanel label="Checking pipeline trust" />;
  const runs = pipelineRuns.data ?? [];
  const latest = runs[0];

  return (
    <div className="space-y-7">
      <LensHeader
        eyebrow="Pipeline Lens"
        title="Can I trust this data?"
        subtitle="Quality, source health, validations and run history are grouped as a ledger instead of an admin control panel."
      />
      {data && (
        <Surface level={3} className="p-7">
          <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Quality score</p>
              <p className="mt-4 text-7xl font-semibold leading-none text-slate-950">{data.quality_score}%</p>
              <ProgressLine value={data.quality_score} className="mt-6" />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <TrustFact label="Raw jobs" value={data.total_raw_jobs} />
              <TrustFact label="Clean jobs" value={data.total_clean_jobs} />
              <TrustFact label="Latest run" value={latest?.status ?? "none"} />
            </div>
          </div>
        </Surface>
      )}
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Surface level={2} className="p-5">
          <h2 className="mb-4 text-xl font-semibold text-slate-950">Source ledger</h2>
          <SourceHealthLedger sources={sources.data} health={sourceHealth.data ?? []} />
        </Surface>
        <Surface level={2} className="p-5">
          <h2 className="mb-4 text-xl font-semibold text-slate-950">Issue pulse</h2>
          <div className="space-y-3">
            {(issues.data ?? []).slice(0, 5).map((issue) => (
              <div key={issue.title} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <span className="text-sm text-slate-600">{issue.title}</span>
                <span className="font-semibold text-slate-950">{issue.count}</span>
              </div>
            ))}
          </div>
        </Surface>
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Surface level={2} className="p-5">
          <h2 className="mb-4 text-xl font-semibold text-slate-950">Validation stack</h2>
          <ValidationStack checks={validations.data ?? []} />
        </Surface>
        <Surface level={2} className="p-5">
          <h2 className="mb-4 text-xl font-semibold text-slate-950">Run timeline</h2>
          <RunTimeline runs={runs} />
        </Surface>
      </div>
    </div>
  );
}

function TrustFact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}
