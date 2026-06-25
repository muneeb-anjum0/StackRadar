import { AiUsage } from "../../types/api";

export function UsagePanel({ usage }: { usage?: AiUsage }) {
  return (
    <div className="rounded-[1.5rem] border border-white/[0.08] bg-[#0d0f12]/72 p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Usage ledger</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <UsageFact label="Mock" value={usage?.mock_reports_total ?? 0} />
        <UsageFact label="OpenRouter" value={usage?.openrouter_reports_total ?? 0} />
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500">Cooldown: {usage?.cooldown_seconds ?? 20}s. Latest OpenRouter call: {usage?.latest_openrouter_report_at ? new Date(usage.latest_openrouter_report_at).toLocaleString() : "none"}</p>
    </div>
  );
}

function UsageFact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-100">{value}</p>
    </div>
  );
}
