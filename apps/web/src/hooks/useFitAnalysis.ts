import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { CountItem, SkillGap } from "../types/api";

export function useFitAnalysis(role: string, currentSkills: string[]) {
  const roles = useQuery({ queryKey: ["top-roles"], queryFn: () => api.get<CountItem[]>("/analytics/top-roles") });
  const analysis = useMutation({
    mutationFn: () =>
      api.post<SkillGap>("/analytics/skill-gap", {
        target_role: role,
        current_skills: currentSkills
      })
  });
  return { roles, analysis };
}
