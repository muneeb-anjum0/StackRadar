import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { AiStatus, Overview, SourceSummary } from "../../types/api";
import { ContextRibbon } from "./ContextRibbon";
import { LensRail } from "./LensRail";
import { SignalCanvas } from "./SignalCanvas";
import { Page } from "./types";

export function ShellFrame({ page, onPage, children }: { page: Page; onPage: (page: Page) => void; children: React.ReactNode }) {
  const overview = useQuery({ queryKey: ["overview"], queryFn: () => api.get<Overview>("/analytics/overview") });
  const sources = useQuery({ queryKey: ["sources"], queryFn: () => api.get<SourceSummary>("/analytics/sources") });
  const aiStatus = useQuery({ queryKey: ["ai-status"], queryFn: () => api.get<AiStatus>("/ai/status") });

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-slate-950">
      <div className="mx-auto grid max-w-[1680px] items-start gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[248px_minmax(0,1fr)] lg:px-8 lg:py-6">
        <LensRail page={page} onPage={onPage} cleanJobs={overview.data?.total_jobs} quality={overview.data?.data_quality_score} />
        <SignalCanvas>
          <ContextRibbon overview={overview.data} sources={sources.data} aiStatus={aiStatus.data} />
          {children}
        </SignalCanvas>
      </div>
    </div>
  );
}
