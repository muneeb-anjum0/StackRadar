import { ReactNode } from "react";

export function InsightRail({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">Insight panel</p>
      <h2 className="mt-2 text-lg font-semibold text-slate-950">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </aside>
  );
}

export function InsightNote({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-slate-100 pt-4 first:border-t-0 first:pt-0">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{value}</p>
    </div>
  );
}
