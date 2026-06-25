import { SourceSummary } from "../../types/api";

export function SourceLedger({ sources }: { sources?: SourceSummary }) {
  return (
    <div className="rounded-[1.25rem] border border-[#20242b] bg-[#0b0d10] px-5 py-4">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Data sources</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-100">Collected versus usable jobs</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-500">Sample data is demo data. API sources are live/local collections.</p>
      </div>
      <div className="divide-y divide-[#20242b]">
        {(sources?.sources ?? []).map((source) => (
          <div key={source.source} className="grid gap-2 py-3 text-sm md:grid-cols-[1fr_90px_90px_1fr] md:items-center">
            <span className="font-medium text-slate-100">{source.source}</span>
            <span className="text-slate-400">{source.raw_jobs} collected</span>
            <span className="text-slate-400">{source.clean_jobs} usable after cleaning</span>
            <span className="text-xs text-slate-500 md:text-right">Last updated: {source.last_collected_at ? new Date(source.last_collected_at).toLocaleString() : "Local seed"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
