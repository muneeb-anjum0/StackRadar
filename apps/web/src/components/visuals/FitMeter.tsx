import { ProgressLine } from "../primitives/ProgressLine";

export function FitMeter({ value, summary }: { value: number; summary: string }) {
  return (
    <div className="rounded-[1.8rem] border border-slate-200 bg-white/90 p-7 shadow-[0_28px_80px_rgba(15,23,42,0.09)]">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Deterministic fit</p>
      <div className="mt-5 flex items-end gap-3">
        <p className="text-7xl font-semibold leading-none text-slate-950">{value}%</p>
        <span className="pb-2 text-sm font-medium text-slate-400">AI used: No</span>
      </div>
      <ProgressLine value={value} className="mt-6" />
      <p className="mt-5 text-sm leading-6 text-slate-500">{summary}</p>
      <p className="mt-3 text-xs text-slate-400">Source: role_skill_summary table and StackRadar analytics.</p>
    </div>
  );
}
