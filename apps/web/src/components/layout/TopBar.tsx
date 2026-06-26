import { Search } from "lucide-react";
import { AiStatus, Overview, SourceSummary } from "../../types/api";
import { Page } from "../shell/types";
import { lensFor } from "./navigation";

export function TopBar({
  page,
  overview,
  sources,
  aiStatus
}: {
  page: Page;
  overview?: Overview;
  sources?: SourceSummary;
  aiStatus?: AiStatus;
}) {
  const lens = lensFor(page);
  const Icon = lens.icon;
  return (
    <header className="sticky top-0 z-10 -mx-4 mb-5 border-b border-white/[0.08] bg-[#111111]/95 px-4 py-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/[0.08] bg-[#151515] text-cyan-100">
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-neutral-50">{lens.label}</p>
            <p className="truncate text-xs text-neutral-500">{lens.description}</p>
          </div>
        </div>
        <div className="flex flex-1 flex-wrap items-center gap-2 xl:max-w-3xl xl:justify-end">
          <label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-full border border-white/[0.08] bg-[#151515] px-3 py-2 text-sm text-neutral-400 xl:max-w-sm">
            <Search className="h-4 w-4 text-neutral-600" />
            <input className="w-full bg-transparent text-sm text-neutral-100 outline-none placeholder:text-neutral-600" placeholder="Command or search signals" />
          </label>
          <StatusPill label="Live Market Snapshot" />
          <StatusPill label={`Clean Jobs: ${sources?.total_clean_jobs ?? overview?.total_jobs ?? "..."}`} />
          <StatusPill label={`Quality: ${overview?.data_quality_score ?? "..."}%`} tone="green" />
          <StatusPill label={`AI: ${aiStatus?.default_provider ?? "mock"}`} />
        </div>
      </div>
    </header>
  );
}

function StatusPill({ label, tone = "neutral" }: { label: string; tone?: "neutral" | "green" }) {
  return (
    <span className={`rounded-full border px-3 py-2 text-xs ${tone === "green" ? "border-emerald-200/20 bg-emerald-300/10 text-emerald-100" : "border-white/[0.08] bg-[#151515] text-neutral-400"}`}>
      {label}
    </span>
  );
}
