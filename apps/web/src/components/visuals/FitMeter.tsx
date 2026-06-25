import { ProgressLine } from "../primitives/ProgressLine";

export function FitMeter({ value, summary }: { value: number; summary: string }) {
  return (
    <div className="rounded-[1.5rem] border border-[#242933] bg-[#0d1014] p-7">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Deterministic fit</p>
      <div className="mt-5 flex items-end gap-3">
        <p className="text-7xl font-semibold leading-none text-slate-50">{value}%</p>
        <span className="pb-2 text-sm font-medium text-slate-400">AI used: No</span>
      </div>
      <ProgressLine value={value} className="mt-6" />
      <p className="mt-5 text-sm leading-6 text-slate-400">{summary}</p>
      <p className="mt-3 text-xs text-slate-500">Source: StackRadar role-skill analytics.</p>
    </div>
  );
}
