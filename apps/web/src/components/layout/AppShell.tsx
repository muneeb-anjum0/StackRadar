import { useState } from "react";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { AiStatus, Overview, SourceSummary } from "../../types/api";
import { Page } from "../shell/types";
import { lenses } from "./navigation";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppShell({ page, onPage, children }: { page: Page; onPage: (page: Page) => void; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const overview = useQuery({ queryKey: ["overview"], queryFn: () => api.get<Overview>("/analytics/overview") });
  const sources = useQuery({ queryKey: ["sources"], queryFn: () => api.get<SourceSummary>("/analytics/sources") });
  const aiStatus = useQuery({ queryKey: ["ai-status"], queryFn: () => api.get<AiStatus>("/ai/status") });

  return (
    <div className="min-h-screen bg-[#111111] text-neutral-100">
      <div className="pointer-events-none fixed inset-0 cockpit-grid opacity-30" />
      <div className="relative flex min-h-screen">
        <Sidebar page={page} collapsed={collapsed} onPage={onPage} onCollapsed={setCollapsed} />
        <div className="min-w-0 flex-1 px-4 pb-12 sm:px-6 lg:px-8">
          <TopBar page={page} overview={overview.data} sources={sources.data} aiStatus={aiStatus.data} />
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {lenses.map((lens) => (
              <button
                key={lens.id}
                type="button"
                onClick={() => onPage(lens.id)}
                className={`shrink-0 rounded-full border px-3 py-2 text-xs ${page === lens.id ? "border-cyan-200/30 bg-cyan-200/10 text-cyan-100" : "border-white/[0.08] bg-[#151515] text-neutral-500"}`}
              >
                {lens.label}
              </button>
            ))}
          </div>
          <motion.main
            key={page}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="mx-auto max-w-[1480px]"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  );
}

export type { Page };
