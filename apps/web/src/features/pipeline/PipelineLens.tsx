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
        subtitle="Check whether the data behind the insights is fresh, clean and trustworthy."
      />
      {data && (
        <Surface level={3} className="p-7">
          <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Trust signal</p>
              <p className="mt-4 text-7xl font-semibold leading-none text-slate-50">{data.quality_score}%</p>
              <ProgressLine value={data.quality_score} className="mt-6" />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <TrustFact label="Is it fresh?" value={data.run_at ? new Date(data.run_at).toLocaleString() : "No run yet"} />
              <TrustFact label="Is it clean?" value={`${data.total_clean_jobs} usable after cleaning`} />
              <TrustFact label="Do not fully trust yet" value={`${data.noisy_classification_count ?? 0} noisy classifications`} />
            </div>
          </div>
        </Surface>
      )}
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Surface level={2} className="p-5">
          <h2 className="mb-4 text-xl font-semibold text-slate-100">Data sources</h2>
          <SourceHealthLedger sources={sources.data} health={sourceHealth.data ?? []} />
        </Surface>
        <Surface level={2} className="p-5">
          <h2 className="mb-4 text-xl font-semibold text-slate-100">Issue pulse</h2>
          <div className="space-y-3">
            {(issues.data ?? []).slice(0, 5).map((issue) => (
              <div key={issue.title} className="flex items-center justify-between gap-3 border-b border-white/[0.07] pb-3">
                <span className="text-sm text-slate-400">{issue.title}</span>
                <span className="font-semibold text-slate-100">{issue.count}</span>
              </div>
            ))}
          </div>
        </Surface>
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Surface level={2} className="p-5">
          <h2 className="mb-4 text-xl font-semibold text-slate-100">Data checks</h2>
          <ValidationStack checks={validations.data ?? []} />
        </Surface>
        <Surface level={2} className="p-5">
          <h2 className="mb-4 text-xl font-semibold text-slate-100">Pipeline history</h2>
          <RunTimeline runs={runs} />
        </Surface>
      </div>
    </div>
  );
}

function TrustFact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0d0f12]/72 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-100">{value}</p>
    </div>
  );
}
