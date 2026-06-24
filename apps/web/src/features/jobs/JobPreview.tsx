import { salary, shortDate } from "../../lib/format";
import { Job } from "../../types/api";
import { SignalBadge } from "../../components/primitives/SignalBadge";

export function JobPreview({ job }: { job?: Job }) {
  if (!job) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white/50 p-6 text-sm text-slate-500">
        Select an evidence row to inspect the source posting signal.
      </div>
    );
  }
  return (
    <aside className="sticky top-6 h-[calc(100vh-3rem)] overflow-y-auto rounded-[1.5rem] border border-slate-200 bg-white p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Evidence preview</p>
      <h2 className="mt-4 text-xl font-semibold text-slate-950">{job.normalized_title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{job.company ?? "Unknown company"} / {job.normalized_role}</p>
      <div className="mt-4 grid gap-2 text-sm">
        <PreviewFact label="Salary" value={salary(job.salary_min, job.salary_max, job.currency)} />
        <PreviewFact label="Seniority" value={job.seniority} />
        <PreviewFact label="Posted" value={shortDate(job.posted_at)} />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">{job.skills.slice(0, 10).map((skill) => <SignalBadge key={skill.id}>{skill.name}</SignalBadge>)}</div>
      {job.job_url && <a className="mt-5 inline-flex text-sm font-medium text-slate-900 underline-offset-4 hover:underline" href={job.job_url} target="_blank" rel="noreferrer">Open source posting</a>}
    </aside>
  );
}

function PreviewFact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3 border-b border-slate-100 pb-2">
      <span className="text-slate-400">{label}</span>
      <span className="text-right font-medium text-slate-800">{value}</span>
    </div>
  );
}
