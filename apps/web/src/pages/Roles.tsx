import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChartCard } from "../components/ui/ChartCard";
import { Select } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import { RoleBarChart } from "../components/charts/RoleBarChart";
import { WorkModePieChart } from "../components/charts/WorkModePieChart";
import { PageHeader } from "../components/layout/PageHeader";
import { api } from "../lib/api";
import { salary } from "../lib/format";
import { CountItem, RoleAnalytics } from "../types/api";

export function Roles() {
  const roles = useQuery({ queryKey: ["top-roles"], queryFn: () => api.get<CountItem[]>("/analytics/top-roles") });
  const [role, setRole] = useState("Backend Developer");
  const detail = useQuery({ queryKey: ["role", role], queryFn: () => api.get<RoleAnalytics>(`/analytics/role/${encodeURIComponent(role)}`) });
  const roleOptions = (roles.data ?? []).map((item) => item.name);
  const data = detail.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Role Analyzer"
        subtitle="Compare role-level demand, salary coverage, seniority shape, work modes and common hiring companies."
      />
      <Select value={role} onChange={(event) => setRole(event.target.value)} options={roleOptions} placeholder="Choose role" className="w-full sm:w-80" />
      {data && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="glass rounded-2xl p-5"><p className="text-sm text-slate-500">Jobs</p><p className="mt-2 text-2xl font-semibold text-slate-950">{data.total_jobs}</p></div>
            <div className="glass rounded-2xl p-5"><p className="text-sm text-slate-500">Salary estimate</p><p className="mt-2 text-2xl font-semibold text-slate-950">{salary(data.salary_min, data.salary_max)}</p></div>
            <div className="glass rounded-2xl p-5"><p className="text-sm text-slate-500">Primary skill</p><p className="mt-2 text-2xl font-semibold text-slate-950">{data.top_skills[0]?.name ?? "N/A"}</p></div>
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            <ChartCard title="Required Skills"><RoleBarChart data={data.top_skills} /></ChartCard>
            <ChartCard title="Work Mode Mix"><WorkModePieChart data={data.common_work_modes} /></ChartCard>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <section className="glass rounded-2xl p-5"><h3 className="mb-3 font-medium text-slate-900">Seniority</h3><div className="flex flex-wrap gap-2">{data.seniority_distribution.map((item) => <Badge key={item.name}>{item.name}: {item.count}</Badge>)}</div></section>
            <section className="glass rounded-2xl p-5"><h3 className="mb-3 font-medium text-slate-900">Top Companies</h3><div className="flex flex-wrap gap-2">{data.top_companies.map((item) => <Badge key={item.name} tone="accent">{item.name}</Badge>)}</div></section>
          </div>
        </>
      )}
    </div>
  );
}
