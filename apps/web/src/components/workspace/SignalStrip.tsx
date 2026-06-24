import { ReactNode } from "react";

export function SignalStrip({ children }: { children: ReactNode }) {
  return <div className="flex gap-3 overflow-x-auto rounded-[1.5rem] border border-slate-200 bg-white/85 p-3">{children}</div>;
}

export function SignalCell({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-44 rounded-2xl bg-slate-50 px-4 py-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}
