import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { PageHeader } from "../components/layout/PageHeader";
import { api } from "../lib/api";
import { salary } from "../lib/format";
import { CountItem, JobResponse } from "../types/api";

export function Jobs() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [skill, setSkill] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [seniority, setSeniority] = useState("");
  const roles = useQuery({ queryKey: ["top-roles"], queryFn: () => api.get<CountItem[]>("/analytics/top-roles") });
  const skills = useQuery({ queryKey: ["top-skills"], queryFn: () => api.get<CountItem[]>("/analytics/top-skills") });
  const params = new URLSearchParams({ query, role, skill, work_mode: workMode, seniority });
  const jobs = useQuery({ queryKey: ["jobs", query, role, skill, workMode, seniority], queryFn: () => api.get<JobResponse>(`/jobs/search?${params}`) });
  const roleOptions = useMemo(() => (roles.data ?? []).map((item) => item.name), [roles.data]);
  const skillOptions = useMemo(() => (skills.data ?? []).map((item) => item.name), [skills.data]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Jobs Explorer"
        subtitle="Search cleaned postings and combine role, skill, seniority and work-mode filters without leaving the dashboard."
      />
      <section className="glass grid gap-3 rounded-2xl p-4 md:grid-cols-5">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search jobs" className="w-full md:col-span-2" />
        <Select value={role} onChange={(event) => setRole(event.target.value)} options={roleOptions} placeholder="Role" />
        <Select value={skill} onChange={(event) => setSkill(event.target.value)} options={skillOptions} placeholder="Skill" />
        <Select value={workMode} onChange={(event) => setWorkMode(event.target.value)} options={["Remote", "Hybrid", "Onsite", "Unknown"]} placeholder="Work mode" />
      </section>
      <div className="flex gap-3">
        <Select value={seniority} onChange={(event) => setSeniority(event.target.value)} options={["Intern", "Entry Level", "Junior", "Mid-Level", "Senior", "Lead", "Unknown"]} placeholder="Seniority" className="w-52" />
        <Button variant="secondary" onClick={() => { setQuery(""); setRole(""); setSkill(""); setWorkMode(""); setSeniority(""); }}>Reset</Button>
      </div>
      {!jobs.data?.jobs.length && <EmptyState title="No jobs match these filters." />}
      <div className="grid gap-4">
        {jobs.data?.jobs.map((job) => (
          <article key={job.id} className="glass rounded-2xl p-5 transition hover:-translate-y-1">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">{job.normalized_title}</h3>
                <p className="mt-1 text-sm text-slate-500">{job.company ?? "Unknown company"} · {[job.city, job.country].filter(Boolean).join(", ") || "Unknown location"}</p>
              </div>
              <div className="flex flex-wrap gap-2"><Badge tone="accent">{job.normalized_role}</Badge><Badge>{job.work_mode}</Badge><Badge>{job.seniority}</Badge></div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge tone="good">{salary(job.salary_min, job.salary_max, job.currency)}</Badge>
              {job.skills.slice(0, 8).map((item) => <Badge key={item.id}>{item.name}</Badge>)}
            </div>
            {job.job_url && <a className="mt-4 inline-flex text-sm font-medium text-slate-700 underline-offset-4 hover:underline" href={job.job_url} target="_blank" rel="noreferrer">View details</a>}
          </article>
        ))}
      </div>
    </div>
  );
}
