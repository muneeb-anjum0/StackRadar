import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChartCard } from "../components/ui/ChartCard";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { SkillBarChart } from "../components/charts/SkillBarChart";
import { PageHeader } from "../components/layout/PageHeader";
import { api } from "../lib/api";
import { CountItem, JobResponse } from "../types/api";

export function Skills() {
  const [query, setQuery] = useState("");
  const skills = useQuery({ queryKey: ["top-skills"], queryFn: () => api.get<CountItem[]>("/analytics/top-skills") });
  const jobs = useQuery({ queryKey: ["jobs-skill-categories"], queryFn: () => api.get<JobResponse>("/jobs?limit=200") });
  const filtered = (skills.data ?? []).filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    jobs.data?.jobs.flatMap((job) => job.skills).forEach((skill) => map.set(skill.category, (map.get(skill.category) ?? 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [jobs.data]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skills Intelligence"
        subtitle="Explore ranked demand signals and category coverage from extracted skills in cleaned job descriptions."
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search skills" className="sm:w-80" />
        <div className="flex flex-wrap gap-2">{categories.map(([name, count]) => <Badge key={name}>{name}: {count}</Badge>)}</div>
      </div>
      <ChartCard title="Ranked Skill Demand">{skills.data && <SkillBarChart data={filtered} />}</ChartCard>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((skill) => (
          <div key={skill.name} className="glass rounded-2xl p-4 transition hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-slate-950">{skill.name}</h3>
              <Badge tone="accent">{skill.percentage}%</Badge>
            </div>
            <p className="mt-3 text-sm text-slate-500">{skill.count} jobs mention this skill.</p>
          </div>
        ))}
      </div>
    </div>
  );
}
