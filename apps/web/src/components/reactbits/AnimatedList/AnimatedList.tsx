import { motion } from "motion/react";

export function AnimatedList({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035 } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedListItem({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
