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
  const [filters, setFilters] = useState({
    query: "",
    role: "",
    skill: "",
    workMode: "",
    seniority: "",
    source: "",
    salaryAvailable: false,
    hasSkills: false,
    hideNonTechnical: true,
    showLowConfidence: false
  });
  const [selected, setSelected] = useState<Job | undefined>();
  const roles = useQuery({ queryKey: ["top-roles"], queryFn: () => api.get<CountItem[]>("/analytics/top-roles") });
  const skills = useQuery({ queryKey: ["top-skills"], queryFn: () => api.get<CountItem[]>("/analytics/top-skills") });
  const sources = useQuery({ queryKey: ["sources"], queryFn: () => api.get<SourceSummary>("/analytics/sources") });
  const params = new URLSearchParams({ query: filters.query, role: filters.role, skill: filters.skill, work_mode: filters.workMode, seniority: filters.seniority, source: filters.source });
  const jobs = useQuery({ queryKey: ["jobs", filters], queryFn: () => api.get<JobResponse>(`/jobs/search?${params}`) });
  const roleOptions = useMemo(() => (roles.data ?? []).map((item) => item.name), [roles.data]);
  const skillOptions = useMemo(() => (skills.data ?? []).map((item) => item.name), [skills.data]);
  const sourceOptions = useMemo(() => (sources.data?.sources ?? []).map((item) => item.source), [sources.data]);
  const visibleJobs = useMemo(() => {
    return (jobs.data?.jobs ?? []).filter((job) => {
      if (filters.salaryAvailable && (!job.salary_min || !job.salary_max)) return false;
      if (filters.hasSkills && !job.skills.length) return false;
      if (filters.hideNonTechnical && !job.is_technical) return false;
      if (!filters.showLowConfidence && job.classification_confidence === "low") return false;
      return true;
    });
  }, [jobs.data, filters]);

  return (
    <div className="space-y-7">
      <LensHeader
        eyebrow="Jobs Lens"
        title="Jobs"
        subtitle="Inspect the real job posts behind the analytics and catch noisy classifications."
      />
      <FilterRibbon
        {...filters}
        roleOptions={roleOptions}
        skillOptions={skillOptions}
        sourceOptions={sourceOptions}
        onChange={(patch) => setFilters((current) => ({ ...current, ...patch }))}
        onReset={() => setFilters({ query: "", role: "", skill: "", workMode: "", seniority: "", source: "", salaryAvailable: false, hasSkills: false, hideNonTechnical: true, showLowConfidence: false })}
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-3">
          {jobs.isLoading && <LoadingPanel label="Loading evidence rows" />}
          {!jobs.isLoading && !visibleJobs.length && <EmptyPanel title="No jobs match these filters." />}
          {visibleJobs.map((job) => <EvidenceRow key={job.id} job={job} selected={selected?.id === job.id} onSelect={setSelected} />)}
        </div>
        <JobPreview job={selected ?? visibleJobs[0]} />
      </div>
    </div>
  );
}
