import { SourceHealth, SourceItem } from "../../types/api";
import { SignalBadge } from "../primitives/SignalBadge";

export function PipelineLedger({ sources, health }: { sources: SourceItem[]; health: SourceHealth[] }) {
  const healthBySource = new Map(health.map((item) => [item.source, item]));
  return (
    <div className="divide-y divide-white/[0.07]">
      {sources.map((source) => {
        const state = healthBySource.get(source.source);
        return (
          <div key={source.source} className="grid gap-3 py-4 md:grid-cols-[1fr_130px_170px_140px] md:items-center">
            <div>
              <p className="font-medium text-slate-100">{source.source}</p>
              <p className="mt-1 text-xs text-slate-500">Last updated: {source.last_collected_at ? new Date(source.last_collected_at).toLocaleString() : "N/A"}</p>
            </div>
            <p className="text-sm text-slate-400">{source.raw_jobs} collected</p>
            <p className="text-sm text-slate-400">{source.clean_jobs} usable after cleaning</p>
            <SignalBadge tone={state?.status === "healthy" ? "good" : "neutral"}>{state?.status ?? "tracked"}</SignalBadge>
          </div>
        );
      })}
    </div>
  );
}
