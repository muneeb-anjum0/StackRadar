import { AiStatus, Overview, SourceSummary } from "../../types/api";

export function ContextRibbon({ overview, sources, aiStatus }: { overview?: Overview; sources?: SourceSummary; aiStatus?: AiStatus }) {
  const freshness = sources?.last_collected_at ? new Date(sources.last_collected_at).toLocaleDateString() : "local seed";
  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-[1.15rem] border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
      <RibbonItem label="Dataset" value={`${overview?.total_jobs ?? "..."} clean jobs`} />
      <RibbonItem label="Quality" value={`${overview?.data_quality_score ?? "..."}%`} />
      <RibbonItem label="Freshness" value={freshness} />
      <RibbonItem label="Mode" value={sources?.mode ?? "API-backed"} />
      <RibbonItem label="AI provider" value={aiStatus?.default_provider ?? "mock"} />
    </div>
  );
}

function RibbonItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-slate-800">{value}</span>
    </span>
  );
}
