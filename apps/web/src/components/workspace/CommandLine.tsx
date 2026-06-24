import { ReactNode } from "react";

export function CommandLine({ children }: { children: ReactNode }) {
  return (
    <section className="flex min-h-16 flex-wrap items-center gap-3 rounded-[1.5rem] border border-slate-200 bg-white/95 px-4 py-3 shadow-sm">
      {children}
    </section>
  );
}
