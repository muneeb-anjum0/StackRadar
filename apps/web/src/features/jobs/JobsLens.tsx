import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LensHeader } from "../../components/shell/LensHeader";
import { LoadingPanel } from "../../components/primitives/LoadingPanel";
import { EmptyPanel } from "../../components/primitives/EmptyPanel";
import { api } from "../../lib/api";
import { CountItem, Job, JobResponse, SourceSummary } from "../../types/api";
import { EvidenceRow } from "./EvidenceRow";
import { FilterRibbon } from "./FilterRibbon";
import { JobPreview } from "./JobPreview";

export function JobsLens() {
  const [filters, setFilters] = useState({ query: "", role: "", skill: "", workMode: "", seniority: "", source: "" });
  const [selected, setSelected] = useState<Job | undefined>();
  const roles = useQuery({ queryKey: ["top-roles"], queryFn: () => api.get<CountItem[]>("/analytics/top-roles") });
  const skills = useQuery({ queryKey: ["top-skills"], queryFn: () => api.get<CountItem[]>("/analytics/top-skills") });
  const sources = useQuery({ queryKey: ["sources"], queryFn: () => api.get<SourceSummary>("/analytics/sources") });
  const params = new URLSearchParams({ query: filters.query, role: filters.role, skill: filters.skill, work_mode: filters.workMode, seniority: filters.seniority, source: filters.source });
  const jobs = useQuery({ queryKey: ["jobs", filters], queryFn: () => api.get<JobResponse>(`/jobs/search?${params}`) });
  const roleOptions = useMemo(() => (roles.data ?? []).map((item) => item.name), [roles.data]);
  const skillOptions = useMemo(() => (skills.data ?? []).map((item) => item.name), [skills.data]);
  const sourceOptions = useMemo(() => (sources.data?.sources ?? []).map((item) => item.source), [sources.data]);

  return (
    <div className="space-y-7">
      <LensHeader
        eyebrow="Jobs Lens"
        title="Evidence behind the signals"
        subtitle="Browse normalized postings as compact evidence rows. Select one row only when you need the source details."
      />
      <FilterRibbon
        {...filters}
        roleOptions={roleOptions}
        skillOptions={skillOptions}
        sourceOptions={sourceOptions}
        onChange={(patch) => setFilters((current) => ({ ...current, ...patch }))}
        onReset={() => setFilters({ query: "", role: "", skill: "", workMode: "", seniority: "", source: "" })}
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-3">
          {jobs.isLoading && <LoadingPanel label="Loading evidence rows" />}
          {!jobs.isLoading && !jobs.data?.jobs.length && <EmptyPanel title="No jobs match these filters." />}
          {jobs.data?.jobs.map((job) => <EvidenceRow key={job.id} job={job} selected={selected?.id === job.id} onSelect={setSelected} />)}
        </div>
        <JobPreview job={selected ?? jobs.data?.jobs[0]} />
      </div>
    </div>
  );
}
