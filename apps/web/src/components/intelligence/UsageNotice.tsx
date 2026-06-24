import { AiUsage } from "../../types/api";

export function UsageNotice({ usage, sessionCount }: { usage?: AiUsage; sessionCount: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/85 p-4 text-sm leading-6 text-slate-600">
      <p className="font-semibold text-slate-950">Gemini is manual only</p>
      <p className="mt-2">Gemini uses your API quota. Use only when needed.</p>
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <span className="rounded-xl bg-slate-50 p-3">Session Gemini<br /><b>{sessionCount}</b></span>
        <span className="rounded-xl bg-slate-50 p-3">Stored Gemini<br /><b>{usage?.gemini_reports_total ?? 0}</b></span>
        <span className="rounded-xl bg-slate-50 p-3">Cooldown<br /><b>{usage?.cooldown_seconds ?? 20}s</b></span>
      </div>
    </div>
  );
}
