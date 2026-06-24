import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { CountItem, RoleAnalytics } from "../types/api";

export function useRoleData(role: string) {
  const roles = useQuery({ queryKey: ["top-roles"], queryFn: () => api.get<CountItem[]>("/analytics/top-roles") });
  const detail = useQuery({ queryKey: ["role", role], queryFn: () => api.get<RoleAnalytics>(`/analytics/role/${encodeURIComponent(role)}`) });
  return { roles, detail, roleOptions: (roles.data ?? []).map((item) => item.name) };
}
