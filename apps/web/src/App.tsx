import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { AppShell, Page } from "./components/layout/AppShell";
import { DataQuality } from "./pages/DataQuality";
import { Jobs } from "./pages/Jobs";
import { Intelligence } from "./pages/Intelligence";
import { Overview } from "./pages/Overview";
import { Roles } from "./pages/Roles";
import { SkillGap } from "./pages/SkillGap";
import { Skills } from "./pages/Skills";

const pages: Record<Page, JSX.Element> = {
  overview: <Overview />,
  skills: <Skills />,
  roles: <Roles />,
  gap: <SkillGap />,
  intelligence: <Intelligence />,
  quality: <DataQuality />,
  jobs: <Jobs />
};

export default function App() {
  const [page, setPage] = useState<Page>("overview");
  return (
    <AppShell page={page} onPage={setPage}>
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {pages[page]}
        </motion.div>
      </AnimatePresence>
    </AppShell>
  );
}
