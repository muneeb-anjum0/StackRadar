import { ReactNode } from "react";

export function WorkspaceCanvas({ children }: { children: ReactNode }) {
  return <div className="space-y-6 rounded-[2rem] border border-white/80 bg-white/35 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">{children}</div>;
}
