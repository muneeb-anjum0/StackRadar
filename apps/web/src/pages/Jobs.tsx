import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { CommandStrip } from "../components/workspace/CommandStrip";
import { ModuleCard } from "../components/workspace/ModuleCard";
import { StatPill } from "../components/workspace/Pills";
import { WorkspaceHeader } from "../components/workspace/WorkspaceHeader";
import { api } from "../lib/api";
import { salary, shortDate } from "../lib/format";
import { CountItem, JobResponse, SourceSummary } from "../types/api";

export function Jobs() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [skill, setSkill] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [seniority, setSeniority] = useState("");
  const [source, setSource] = useState("");
  const roles = useQuery({ queryKey: ["top-roles"], queryFn: () => api.get<CountItem[]>("/analytics/top-roles") });
  const skills = useQuery({ queryKey: ["top-skills"], queryFn: () => api.get<CountItem[]>("/analytics/top-skills") });
  const sources = useQuery({ queryKey: ["sources"], queryFn: () => api.get<SourceSummary>("/analytics/sources") });
  const params = new URLSearchParams({ query, role, skill, work_mode: workMode, seniority, source });
  const jobs = useQuery({ queryKey: ["jobs", query, role, skill, workMode, seniority, source], queryFn: () => api.get<JobResponse>(`/jobs/search?${params}`) });
  const roleOptions = useMemo(() => (roles.data ?? []).map((item) => item.name), [roles.data]);
  const skillOptions = useMemo(() => (skills.data ?? []).map((item) => item.name), [skills.data]);
  const sourceOptions = useMemo(() => (sources.data?.sources ?? []).map((item) => item.source), [sources.data]);
  const activeFilters = [role, skill, workMode, seniority, source].filter(Boolean);

  return (
    <div className="space-y-6">
      <WorkspaceHeader
        label="Market browser"
        title="Browse cleaned postings like market evidence"
        subtitle="Search and filter normalized jobs while keeping role, salary, mode and extracted skills visible."
        meta={`${jobs.data?.total ?? 0} matching jobs`}
      />
      <CommandStrip>
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search jobs" className="w-full md:min-w-72 md:flex-1" />
        <Select value={role} onChange={(event) => setRole(event.target.value)} options={roleOptions} placeholder="Role" />
        <Select value={skill} onChange={(event) => setSkill(event.target.value)} options={skillOptions} placeholder="Skill" />
        <Select value={workMode} onChange={(event) => setWorkMode(event.target.value)} options={["Remote", "Hybrid", "Onsite", "Unknown"]} placeholder="Work mode" />
        <Select value={source} onChange={(event) => setSource(event.target.value)} options={sourceOptions} placeholder="Source" />
      </CommandStrip>
      <div className="flex flex-wrap items-center gap-3">
        <Select value={seniority} onChange={(event) => setSeniority(event.target.value)} options={["Intern", "Entry Level", "Junior", "Mid-Level", "Senior", "Lead", "Unknown"]} placeholder="Seniority" className="w-52" />
        <Button variant="secondary" onClick={() => { setQuery(""); setRole(""); setSkill(""); setWorkMode(""); setSeniority(""); setSource(""); }}>Reset filters</Button>
        <StatPill label="Active filters" value={activeFilters.length || "none"} />
      </div>
      <ModuleCard title="Filter Summary" eyebrow="Current lens">
        <div className="flex flex-wrap gap-2">
          <StatPill label="Query" value={query || "all"} />
          <StatPill label="Role" value={role || "all"} />
          <StatPill label="Skill" value={skill || "all"} />
          <StatPill label="Mode" value={workMode || "all"} />
          <StatPill label="Seniority" value={seniority || "all"} />
          <StatPill label="Source" value={source || "all"} />
        </div>
      </ModuleCard>
      {!jobs.data?.jobs.length && <EmptyState title="No jobs match these filters." />}
      <div className="grid gap-4">
        {jobs.data?.jobs.map((job) => (
          <article key={job.id} className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_250px]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="accent">{job.normalized_role}</Badge>
                  <Badge>{job.source}</Badge>
                  <Badge>{job.work_mode}</Badge>
                  <Badge>{job.seniority}</Badge>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-slate-950">{job.normalized_title}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {job.company ?? "Unknown company"} / {[job.city, job.country].filter(Boolean).join(", ") || "Unknown location"}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Posted: {shortDate(job.posted_at)} / Collected: {shortDate(job.collected_at)}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {job.skills.slice(0, 8).map((item) => <Badge key={item.id}>{item.name}</Badge>)}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">Compensation</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{salary(job.salary_min, job.salary_max, job.currency)}</p>
                {job.job_url && <a className="mt-4 inline-flex text-sm font-medium text-slate-700 underline-offset-4 hover:underline" href={job.job_url} target="_blank" rel="noreferrer">View details</a>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
