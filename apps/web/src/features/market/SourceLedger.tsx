import { SourceSummary } from "../../types/api";

export function SourceLedger({ sources }: { sources?: SourceSummary }) {
  return (
    <div className="rounded-[1.35rem] border border-slate-200 bg-white/70 px-5 py-2">
      <div className="divide-y divide-slate-100">
        {(sources?.sources ?? []).map((source) => (
          <div key={source.source} className="grid gap-2 py-3 text-sm md:grid-cols-[1fr_90px_90px_1fr] md:items-center">
            <span className="font-medium text-slate-900">{source.source}</span>
            <span className="text-slate-500">{source.raw_jobs} raw</span>
            <span className="text-slate-500">{source.clean_jobs} clean</span>
            <span className="text-xs text-slate-400 md:text-right">{source.last_collected_at ? new Date(source.last_collected_at).toLocaleString() : "Local seed"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
