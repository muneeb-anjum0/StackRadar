import { useQuery } from "@tanstack/react-query";
import { QualityCard } from "../components/cards/QualityCard";
import { InsightNote, InsightRail } from "../components/workspace/InsightRail";
import { ModuleCard } from "../components/workspace/ModuleCard";
import { PageFrame } from "../components/workspace/PageFrame";
import { StatPill } from "../components/workspace/Pills";
import { WorkspaceHeader } from "../components/workspace/WorkspaceHeader";
import { api } from "../lib/api";
import { QualityIssue, QualitySummary, SourceSummary } from "../types/api";

export function DataQuality() {
  const summary = useQuery({ queryKey: ["quality-summary"], queryFn: () => api.get<QualitySummary>("/quality/summary") });
  const issues = useQuery({ queryKey: ["quality-issues"], queryFn: () => api.get<QualityIssue[]>("/quality/issues") });
  const sources = useQuery({ queryKey: ["sources"], queryFn: () => api.get<SourceSummary>("/analytics/sources") });
  const data = summary.data;

  return (
    <PageFrame
      rail={
        data && (
          <InsightRail title="Pipeline signals">
            <InsightNote label="Quality" value={`${data.quality_score}% quality score after the latest cleaning run.`} />
            <InsightNote label="Deduplication" value={`${data.duplicate_count} duplicate postings were removed.`} />
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
      <div className="grid gap-5 md:grid-cols-2">
        <ModuleCard title="Source Health" eyebrow="Collectors">
          <div className="space-y-3">
            {(sources.data?.sources ?? []).map((source) => (
              <div key={source.source} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-medium text-slate-900">{source.source}</h3>
                  <span className="text-xs text-slate-500">{source.clean_jobs} clean</span>
                </div>
                <p className="mt-2 text-sm text-slate-500">{source.raw_jobs} raw jobs / {source.missing_salary_count} missing salary</p>
                <p className="mt-1 text-xs text-slate-400">Last collected: {source.last_collected_at ? new Date(source.last_collected_at).toLocaleString() : "N/A"}</p>
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
      <div className="grid gap-5 md:grid-cols-1">
        <ModuleCard title="Pipeline Health Log" eyebrow="Run notes">
          <div className="space-y-3 text-sm leading-6 text-slate-600">
            <p>Raw records are preserved separately from cleaned records.</p>
            <p>Duplicate handling uses source IDs and content fingerprints.</p>
            <p>Skill extraction coverage is tracked as a quality signal.</p>
            <p>Salary parsing gaps are visible instead of hidden.</p>
          </div>
        </ModuleCard>
      </div>
    </PageFrame>
  );
}
