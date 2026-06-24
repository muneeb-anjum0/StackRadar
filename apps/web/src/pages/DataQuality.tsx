import { useQuery } from "@tanstack/react-query";
import { QualityCard } from "../components/cards/QualityCard";
import { InsightNote, InsightRail } from "../components/workspace/InsightRail";
import { ModuleCard } from "../components/workspace/ModuleCard";
import { PageFrame } from "../components/workspace/PageFrame";
import { StatPill } from "../components/workspace/Pills";
import { WorkspaceHeader } from "../components/workspace/WorkspaceHeader";
import { api } from "../lib/api";
import { PipelineRun, QualityIssue, QualitySummary, SourceHealth, SourceSummary, ValidationCheck } from "../types/api";

const statusClass: Record<string, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  healthy: "border-emerald-200 bg-emerald-50 text-emerald-700",
  passed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  running: "border-blue-200 bg-blue-50 text-blue-700",
  failed: "border-rose-200 bg-rose-50 text-rose-700",
  unknown: "border-slate-200 bg-slate-100 text-slate-600"
};

function StatusChip({ value }: { value: string }) {
  return <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass[value] ?? statusClass.unknown}`}>{value}</span>;
}

function formatTime(value: string | null | undefined) {
  return value ? new Date(value).toLocaleString() : "N/A";
}

function duration(run: PipelineRun) {
  if (!run.finished_at) return "running";
  const seconds = Math.max(0, Math.round((new Date(run.finished_at).getTime() - new Date(run.started_at).getTime()) / 1000));
  return seconds < 60 ? `${seconds}s` : `${Math.round(seconds / 60)}m`;
}

export function DataQuality() {
  const summary = useQuery({ queryKey: ["quality-summary"], queryFn: () => api.get<QualitySummary>("/quality/summary") });
  const issues = useQuery({ queryKey: ["quality-issues"], queryFn: () => api.get<QualityIssue[]>("/quality/issues") });
  const sources = useQuery({ queryKey: ["sources"], queryFn: () => api.get<SourceSummary>("/analytics/sources") });
  const pipelineRuns = useQuery({ queryKey: ["pipeline-runs"], queryFn: () => api.get<PipelineRun[]>("/quality/pipeline-runs") });
  const sourceHealth = useQuery({ queryKey: ["source-health"], queryFn: () => api.get<SourceHealth[]>("/quality/source-health") });
  const validations = useQuery({ queryKey: ["validations"], queryFn: () => api.get<ValidationCheck[]>("/quality/validations") });
  const data = summary.data;
  const runs = pipelineRuns.data ?? [];
  const latestRun = runs[0];
  const lastSuccess = runs.find((run) => run.status === "success");
  const failedRuns = runs.filter((run) => run.status === "failed").length;

  return (
    <PageFrame
      rail={
        data && (
          <InsightRail title="Pipeline signals">
            <InsightNote label="Quality" value={`${data.quality_score}% quality score after the latest cleaning run.`} />
            <InsightNote label="Latest run" value={latestRun ? `${latestRun.run_type} is ${latestRun.status}.` : "No pipeline run has been recorded yet."} />
            <InsightNote label="Coverage" value={`${data.total_clean_jobs} clean jobs are ready for analytics.`} />
          </InsightRail>
        )
      }
    >
      <WorkspaceHeader
        label="Pipeline health"
        title="Data quality as an engineering signal"
        subtitle="Inspect raw-to-clean coverage, duplicate handling, missing fields and validation notes from the local pipeline."
        meta="Latest run"
      />
      {data && (
        <>
          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">Quality score hero</p>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <p className="text-6xl font-semibold text-slate-950">{data.quality_score}%</p>
              <div className="flex flex-wrap gap-2">
                <StatPill label="Raw" value={data.total_raw_jobs} />
                <StatPill label="Clean" value={data.total_clean_jobs} />
                <StatPill label="Duplicates" value={data.duplicate_count} />
              </div>
            </div>
          </section>
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
            <QualityCard label="Raw jobs" value={data.total_raw_jobs} />
            <QualityCard label="Clean jobs" value={data.total_clean_jobs} />
            <QualityCard label="Duplicates" value={data.duplicate_count} />
            <QualityCard label="Missing salary" value={data.missing_salary_count} />
            <QualityCard label="Missing company" value={data.missing_company_count} />
            <QualityCard label="No skills" value={data.jobs_without_skills_count} />
          </div>
        </>
      )}
      <ModuleCard title="Pipeline Status" eyebrow="Orchestration">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Latest</p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-950">{latestRun?.run_type ?? "No runs"}</p>
              {latestRun && <StatusChip value={latestRun.status} />}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Last success</p>
            <p className="mt-3 text-sm font-semibold text-slate-950">{formatTime(lastSuccess?.finished_at)}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Failed runs</p>
            <p className="mt-3 text-2xl font-semibold text-slate-950">{failedRuns}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Tracked runs</p>
            <p className="mt-3 text-2xl font-semibold text-slate-950">{runs.length}</p>
          </div>
        </div>
      </ModuleCard>
      <div className="grid gap-5 md:grid-cols-2">
        <ModuleCard title="Source Health" eyebrow="Collectors">
          <div className="space-y-3">
            {(sourceHealth.data ?? []).map((source) => (
              <div key={source.source} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-medium text-slate-900">{source.source}</h3>
                  <StatusChip value={source.status} />
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {source.fetched_count} fetched / {source.inserted_count} inserted / {source.failed_count} failed
                </p>
                <p className="mt-1 text-xs text-slate-400">Last success: {formatTime(source.last_success_at)} / Clean rate: {source.clean_rate}%</p>
                {source.last_error && <p className="mt-2 text-xs text-rose-600">{source.last_error}</p>}
              </div>
            ))}
            {!sourceHealth.data?.length && (sources.data?.sources ?? []).map((source) => (
              <div key={source.source} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-medium text-slate-900">{source.source}</h3>
                  <span className="text-xs text-slate-500">{source.clean_jobs} clean</span>
                </div>
                <p className="mt-2 text-sm text-slate-500">{source.raw_jobs} raw jobs / {source.missing_salary_count} missing salary</p>
                <p className="mt-1 text-xs text-slate-400">Last collected: {formatTime(source.last_collected_at)}</p>
              </div>
            ))}
          </div>
        </ModuleCard>
        <ModuleCard title="Issue Breakdown" eyebrow="Validation">
          <div className="space-y-3">
            {(issues.data ?? []).map((issue) => (
              <div key={issue.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-slate-900">{issue.title}</h3>
                  <span className="text-sm font-medium text-slate-500">{issue.count}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500">{issue.description}</p>
              </div>
            ))}
          </div>
        </ModuleCard>
      </div>
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <ModuleCard title="Validation Checks" eyebrow="Latest report">
          <div className="space-y-3">
            {(validations.data ?? []).map((check) => (
              <div key={check.check_name} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-medium text-slate-900">{check.check_name.replace(/_/g, " ")}</h3>
                  <StatusChip value={check.status} />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {check.severity} severity / {check.failed_count} failed of {check.total_count}
                </p>
                {check.message && <p className="mt-2 text-sm leading-6 text-slate-500">{check.message}</p>}
              </div>
            ))}
          </div>
        </ModuleCard>
        <ModuleCard title="Run History" eyebrow="Latest 10">
          <div className="space-y-3">
            {runs.slice(0, 10).map((run) => (
              <div key={run.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-medium text-slate-900">{run.run_type}</h3>
                    <p className="mt-1 text-xs text-slate-400">{run.source ?? "all sources"} / {formatTime(run.started_at)} / {duration(run)}</p>
                  </div>
                  <StatusChip value={run.status} />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {run.raw_inserted} raw / {run.clean_created} clean / {run.duplicates_skipped} duplicates / {run.failed_count} failed
                </p>
                {run.message && <p className="mt-2 text-sm leading-6 text-slate-500">{run.message}</p>}
              </div>
            ))}
          </div>
        </ModuleCard>
      </div>
    </PageFrame>
  );
}
