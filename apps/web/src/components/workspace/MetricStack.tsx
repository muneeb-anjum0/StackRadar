import { ReactNode } from "react";

export function MetricStack({ children }: { children: ReactNode }) {
  return <div className="grid gap-3">{children}</div>;
}

export function StackMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}
