import { ReactNode } from "react";

export function ContextStack({ children }: { children: ReactNode }) {
  return <aside className="space-y-3 lg:sticky lg:top-8 lg:h-fit">{children}</aside>;
}

export function ContextItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <div className="mt-2 text-sm leading-6 text-slate-700">{value}</div>
    </div>
  );
}
