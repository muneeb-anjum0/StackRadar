import { useQuery } from "@tanstack/react-query";
import { QualityCard } from "../components/cards/QualityCard";
import { PageHeader } from "../components/layout/PageHeader";
import { api } from "../lib/api";
import { QualityIssue, QualitySummary } from "../types/api";

export function DataQuality() {
  const summary = useQuery({ queryKey: ["quality-summary"], queryFn: () => api.get<QualitySummary>("/quality/summary") });
  const issues = useQuery({ queryKey: ["quality-issues"], queryFn: () => api.get<QualityIssue[]>("/quality/issues") });
  const data = summary.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Quality Monitor"
        subtitle="Track duplicate handling, missing fields, salary coverage and skill extraction quality after each pipeline run."
        chip="Latest run"
      />
      {data && (
        <>
          <section className="glass rounded-2xl p-6">
            <p className="text-sm text-slate-500">Latest quality score</p>
            <p className="mt-4 text-5xl font-semibold text-slate-950">{data.quality_score}%</p>
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
      <div className="grid gap-4 md:grid-cols-2">
        {(issues.data ?? []).map((issue) => (
          <div key={issue.title} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-slate-900">{issue.title}</h3>
              <span className="text-sm text-slate-500">{issue.count}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-500">{issue.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
