import { ReactNode } from "react";
import { motion } from "framer-motion";

export function SmoothSection({ children }: { children: ReactNode }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      {children}
    </motion.div>
  );
}
