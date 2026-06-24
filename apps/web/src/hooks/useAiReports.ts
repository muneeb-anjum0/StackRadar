import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { AiReport, AiStatus, AiUsage } from "../types/api";

export function useAiReports(filters?: { reportType?: string; provider?: string }) {
  const params = new URLSearchParams();
  if (filters?.reportType) params.set("report_type", filters.reportType);
  if (filters?.provider) params.set("provider", filters.provider);
  const query = params.toString();
  return useQuery({
    queryKey: ["ai-reports", filters?.reportType ?? "all", filters?.provider ?? "all"],
    queryFn: () => api.get<AiReport[]>(`/ai/reports${query ? `?${query}` : ""}`)
  });
}

export function useAiStatus() {
  return useQuery({ queryKey: ["ai-status"], queryFn: () => api.get<AiStatus>("/ai/status") });
}

export function useAiUsage() {
  return useQuery({ queryKey: ["ai-usage"], queryFn: () => api.get<AiUsage>("/ai/usage") });
}
