import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { api } from "../lib/api";
import { AiProvider, AiReport, AiReportRequest, ReportType } from "../types/api";

const endpointByType: Record<ReportType, string> = {
  career_report: "/ai/career-report",
  learning_roadmap: "/ai/learning-roadmap",
  project_suggestions: "/ai/project-suggestions",
  role_fit: "/ai/role-fit",
  skill_gap_brief: "/ai/skill-gap-brief",
  job_quality: "/ai/job-quality"
};

export function useAiGenerate(cooldownSeconds = 20) {
  const queryClient = useQueryClient();
  const [lastGeminiAt, setLastGeminiAt] = useState<number | null>(null);
  const [geminiSessionCount, setGeminiSessionCount] = useState(0);
  const [activeType, setActiveType] = useState<ReportType | null>(null);

  const cooldownRemaining = useMemo(() => {
    if (!lastGeminiAt) return 0;
    return Math.max(0, cooldownSeconds - Math.floor((Date.now() - lastGeminiAt) / 1000));
  }, [cooldownSeconds, lastGeminiAt]);

  const mutation = useMutation({
    mutationFn: async ({ reportType, payload }: { reportType: ReportType; payload: AiReportRequest }) => {
      if (payload.provider === "gemini" && cooldownRemaining > 0) {
        throw new Error(`Gemini cooldown is active. Try again in ${cooldownRemaining} seconds.`);
      }
      setActiveType(reportType);
      const report = await api.post<AiReport>(endpointByType[reportType], payload);
      if (payload.provider === "gemini" && !report.reused_from_cache) {
        setLastGeminiAt(Date.now());
        setGeminiSessionCount((count) => count + 1);
      }
      return report;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-reports"] });
      queryClient.invalidateQueries({ queryKey: ["ai-usage"] });
    },
    onSettled: () => setActiveType(null)
  });

  return {
    ...mutation,
    activeType,
    geminiSessionCount,
    cooldownRemaining,
    canUseProvider: (provider: AiProvider) => provider !== "gemini" || cooldownRemaining === 0
  };
}
