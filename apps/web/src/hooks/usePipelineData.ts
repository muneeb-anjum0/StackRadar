import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { PipelineRun, QualityIssue, QualitySummary, SourceHealth, SourceSummary, ValidationCheck } from "../types/api";

export function usePipelineData() {
  const summary = useQuery({ queryKey: ["quality-summary"], queryFn: () => api.get<QualitySummary>("/quality/summary") });
  const issues = useQuery({ queryKey: ["quality-issues"], queryFn: () => api.get<QualityIssue[]>("/quality/issues") });
  const sources = useQuery({ queryKey: ["sources"], queryFn: () => api.get<SourceSummary>("/analytics/sources") });
  const pipelineRuns = useQuery({ queryKey: ["pipeline-runs"], queryFn: () => api.get<PipelineRun[]>("/quality/pipeline-runs") });
  const sourceHealth = useQuery({ queryKey: ["source-health"], queryFn: () => api.get<SourceHealth[]>("/quality/source-health") });
  const validations = useQuery({ queryKey: ["validations"], queryFn: () => api.get<ValidationCheck[]>("/quality/validations") });
  return { summary, issues, sources, pipelineRuns, sourceHealth, validations };
}
