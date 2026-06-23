import { ReactNode } from "react";

export function CommandStrip({ children }: { children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm backdrop-blur sm:flex-row sm:items-center">
      {children}
    </section>
  );
}
