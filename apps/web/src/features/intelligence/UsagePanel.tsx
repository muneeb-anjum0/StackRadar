import { AiUsage } from "../../types/api";

export function UsagePanel({ usage }: { usage?: AiUsage }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Usage ledger</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <UsageFact label="Mock" value={usage?.mock_reports_total ?? 0} />
        <UsageFact label="Gemini" value={usage?.gemini_reports_total ?? 0} />
      </div>
      <p className="mt-4 text-xs leading-5 text-slate-500">Cooldown: {usage?.cooldown_seconds ?? 20}s. Latest Gemini: {usage?.latest_gemini_report_at ? new Date(usage.latest_gemini_report_at).toLocaleString() : "none"}</p>
    </div>
  );
}

function UsageFact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/75 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}
