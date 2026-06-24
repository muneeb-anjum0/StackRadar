import { ReactNode } from "react";

export function FloatingRail({ children }: { children: ReactNode }) {
  return (
    <aside className="flex rounded-2xl border border-slate-200/80 bg-white/85 p-3 shadow-[0_22px_60px_rgba(15,23,42,0.09)] backdrop-blur-xl lg:sticky lg:top-8 lg:min-h-[calc(100vh-4rem)] lg:flex-col">
      {children}
    </aside>
  );
}
