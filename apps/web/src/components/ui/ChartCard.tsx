import { motion } from "framer-motion";

export function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5"
    >
      <h3 className="mb-4 text-sm font-semibold text-slate-800">{title}</h3>
      <div className="h-72">{children}</div>
    </motion.section>
  );
}
