import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import { RoleBarChart } from "../components/charts/RoleBarChart";
import { WorkModePieChart } from "../components/charts/WorkModePieChart";
import { CommandStrip } from "../components/workspace/CommandStrip";
import { InsightNote, InsightRail } from "../components/workspace/InsightRail";
import { ModuleCard } from "../components/workspace/ModuleCard";
import { PageFrame } from "../components/workspace/PageFrame";
import { RankedList } from "../components/workspace/RankedList";
import { StatPill } from "../components/workspace/Pills";
import { WorkspaceHeader } from "../components/workspace/WorkspaceHeader";
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
    <PageFrame
      rail={
        data && (
          <InsightRail title="Role lab notes">
            <InsightNote label="Demand" value={`${data.role} appears in ${data.total_jobs} clean postings.`} />
            <InsightNote label="Core skill" value={`${data.top_skills[0]?.name ?? "No dominant skill"} is the strongest requirement signal.`} />
            <InsightNote label="Work mode" value={`${data.common_work_modes[0]?.name ?? "Unknown"} is the most common work mode for this role.`} />
            <InsightNote label="Compare next" value="Try switching between Backend Developer, Data Analyst and Full Stack Developer." />
          </InsightRail>
        )
      }
    >
      <WorkspaceHeader
        label="Role lab"
        title="Analyze a target role like a market profile"
        subtitle="Choose a role and inspect demand, required skills, salary coverage, seniority shape and hiring companies."
        meta={`${roles.data?.length ?? 0} roles`}
      />
      <CommandStrip>
        <Select value={role} onChange={(event) => setRole(event.target.value)} options={roleOptions} placeholder="Choose role" className="w-full sm:w-80" />
        {data && <StatPill label="Selected role" value={data.role} />}
      </CommandStrip>
      {data && (
        <>
          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <ModuleCard title={data.role} eyebrow="Role profile">
              <p className="text-5xl font-semibold text-slate-950">{data.total_jobs}</p>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                clean postings currently classify into this role. Salary range: {salary(data.salary_min, data.salary_max)}.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge tone="accent">{data.top_skills[0]?.name ?? "No top skill"}</Badge>
                <Badge>{data.common_work_modes[0]?.name ?? "Unknown mode"}</Badge>
                <Badge>{data.seniority_distribution[0]?.name ?? "Unknown seniority"}</Badge>
              </div>
            </ModuleCard>
            <ModuleCard title="Role Requirements" eyebrow="Skill stack">
              <RankedList items={data.top_skills.slice(0, 6)} />
            </ModuleCard>
          </div>
          <div className="grid gap-5 xl:grid-cols-2">
            <ModuleCard title="Top Required Skills" eyebrow="Demand chart"><div className="h-80"><RoleBarChart data={data.top_skills} /></div></ModuleCard>
            <ModuleCard title="Work Mode Mix" eyebrow="Access pattern"><div className="h-80"><WorkModePieChart data={data.common_work_modes} /></div></ModuleCard>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <ModuleCard title="Seniority" eyebrow="Hiring level"><div className="flex flex-wrap gap-2">{data.seniority_distribution.map((item) => <Badge key={item.name}>{item.name}: {item.count}</Badge>)}</div></ModuleCard>
            <ModuleCard title="Salary" eyebrow="Parsed range"><p className="text-2xl font-semibold text-slate-950">{salary(data.salary_min, data.salary_max)}</p></ModuleCard>
            <ModuleCard title="Top Companies" eyebrow="Employers"><div className="flex flex-wrap gap-2">{data.top_companies.map((item) => <Badge key={item.name} tone="accent">{item.name}</Badge>)}</div></ModuleCard>
          </div>
        </>
      )}
    </PageFrame>
  );
}
