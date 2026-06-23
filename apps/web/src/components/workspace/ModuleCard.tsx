import { ReactNode } from "react";
import { motion } from "framer-motion";

export function ModuleCard({
  title,
  eyebrow,
  children,
  className = ""
}: {
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ${className}`}
    >
      {(title || eyebrow) && (
        <div className="mb-4">
          {eyebrow && <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{eyebrow}</p>}
          {title && <h2 className="mt-1 text-base font-semibold text-slate-950">{title}</h2>}
        </div>
      )}
      {children}
    </motion.section>
  );
}
