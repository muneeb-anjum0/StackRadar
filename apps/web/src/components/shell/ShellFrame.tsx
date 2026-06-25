import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { AiStatus, Overview, SourceSummary } from "../../types/api";
import { LensRail } from "./LensRail";
import { Page } from "./types";

export function ShellFrame({ page, onPage, children }: { page: Page; onPage: (page: Page) => void; children: React.ReactNode }) {
  const overview = useQuery({ queryKey: ["overview"], queryFn: () => api.get<Overview>("/analytics/overview") });
  const sources = useQuery({ queryKey: ["sources"], queryFn: () => api.get<SourceSummary>("/analytics/sources") });
  const aiStatus = useQuery({ queryKey: ["ai-status"], queryFn: () => api.get<AiStatus>("/ai/status") });

  return (
    <div className="min-h-screen text-slate-100">
      <div className="flex min-h-screen">
        <LensRail
          page={page}
          onPage={onPage}
          cleanJobs={overview.data?.total_jobs}
          quality={overview.data?.data_quality_score}
          aiProvider={aiStatus.data?.default_provider}
        />
        <main className="min-w-0 flex-1 px-4 py-4 transition-all duration-300 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1440px] rounded-[1.8rem] border border-white/[0.08] bg-[#0d0f12]/72 p-4 shadow-[0_40px_140px_rgba(0,0,0,0.34)] backdrop-blur-2xl sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] pb-4 text-xs text-slate-400">
              <span>StackRadar reads job-market demand, role requirements and data quality as one career system.</span>
              <span>{sources.data?.total_clean_jobs ?? overview.data?.total_jobs ?? "..."} usable jobs after cleaning</span>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
