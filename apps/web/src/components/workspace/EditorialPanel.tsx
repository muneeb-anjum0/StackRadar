import { ReactNode } from "react";
import { motion } from "framer-motion";

export function EditorialPanel({ eyebrow, title, children }: { eyebrow?: string; title: string; children: ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[1.75rem] border border-slate-200 bg-white/95 p-7 shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
    >
      {eyebrow && <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{eyebrow}</p>}
      <h2 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">{title}</h2>
      <div className="mt-5 text-sm leading-7 text-slate-600">{children}</div>
    </motion.section>
  );
}
