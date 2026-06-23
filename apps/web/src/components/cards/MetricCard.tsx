import { motion } from "framer-motion";

export function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <motion.div whileHover={{ y: -2 }} className="glass rounded-2xl p-5">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <div className="mt-4 text-2xl font-semibold tracking-normal text-slate-950">{value}</div>
    </motion.div>
  );
}
