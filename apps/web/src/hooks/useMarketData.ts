import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { CountItem, Overview, SourceSummary } from "../types/api";

export function useMarketData() {
  const overview = useQuery({ queryKey: ["overview"], queryFn: () => api.get<Overview>("/analytics/overview") });
  const skills = useQuery({ queryKey: ["top-skills"], queryFn: () => api.get<CountItem[]>("/analytics/top-skills") });
  const roles = useQuery({ queryKey: ["top-roles"], queryFn: () => api.get<CountItem[]>("/analytics/top-roles") });
  const modes = useQuery({ queryKey: ["work-modes"], queryFn: () => api.get<CountItem[]>("/analytics/work-modes") });
  const sources = useQuery({ queryKey: ["sources"], queryFn: () => api.get<SourceSummary>("/analytics/sources") });
  return { overview, skills, roles, modes, sources };
}
