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
        <main className="min-w-0 flex-1 px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1440px] rounded-[1.25rem] border border-[#20242b] bg-[#07090b] p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#20242b] pb-4 text-xs text-slate-400">
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
