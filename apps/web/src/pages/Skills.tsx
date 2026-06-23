import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { SkillBarChart } from "../components/charts/SkillBarChart";
import { CommandStrip } from "../components/workspace/CommandStrip";
import { ModuleCard } from "../components/workspace/ModuleCard";
import { RankedList } from "../components/workspace/RankedList";
import { SkillPill, StatPill } from "../components/workspace/Pills";
import { WorkspaceHeader } from "../components/workspace/WorkspaceHeader";
import { api } from "../lib/api";
import { CountItem, JobResponse } from "../types/api";

export function Skills() {
  const [query, setQuery] = useState("");
  const skills = useQuery({ queryKey: ["top-skills"], queryFn: () => api.get<CountItem[]>("/analytics/top-skills") });
  const jobs = useQuery({ queryKey: ["jobs-skill-categories"], queryFn: () => api.get<JobResponse>("/jobs?limit=200") });
  const filtered = (skills.data ?? []).filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
  const featured = filtered[0] ?? skills.data?.[0];
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    jobs.data?.jobs.flatMap((job) => job.skills).forEach((skill) => map.set(skill.category, (map.get(skill.category) ?? 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [jobs.data]);

  return (
    <div className="space-y-6">
      <WorkspaceHeader
        label="Skill radar"
        title="Demand signals by skill"
        subtitle="Scan extracted skills as ranked market signals, category clusters and lightweight skill clouds."
        meta={`${skills.data?.length ?? 0} tracked skills`}
      />
      <CommandStrip>
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search skills" className="sm:w-80" />
        <div className="flex flex-wrap gap-2">{categories.slice(0, 6).map(([name, count]) => <StatPill key={name} label={name} value={count} />)}</div>
      </CommandStrip>
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <ModuleCard title={featured?.name ?? "No skill selected"} eyebrow="Featured skill">
          <p className="text-5xl font-semibold text-slate-950">{featured?.percentage ?? 0}%</p>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {featured?.count ?? 0} clean jobs mention this skill. Use it as a strong signal for prioritizing practice and project positioning.
          </p>
        </ModuleCard>
        <ModuleCard title="Skill Category Summary" eyebrow="Clusters">
          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map(([name, count]) => (
              <div key={name} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-sm font-medium text-slate-900">{name}</p>
                <p className="mt-1 text-xs text-slate-500">{count} extracted mentions</p>
              </div>
            ))}
          </div>
        </ModuleCard>
      </div>
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <ModuleCard title="Ranked Skill Demand" eyebrow="Priority list"><RankedList items={filtered.slice(0, 10)} /></ModuleCard>
        <ModuleCard title="Demand Chart" eyebrow="Relative volume"><div className="h-96">{skills.data && <SkillBarChart data={filtered} />}</div></ModuleCard>
      </div>
      <ModuleCard title="Skill Cloud" eyebrow="Extracted language">
        <div className="flex flex-wrap gap-2">
          {filtered.map((skill) => <SkillPill key={skill.name}>{skill.name}</SkillPill>)}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {filtered.slice(0, 8).map((skill) => <Badge key={skill.name} tone="accent">{skill.name}: {skill.count}</Badge>)}
        </div>
      </ModuleCard>
    </div>
  );
}
