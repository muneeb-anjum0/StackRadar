import { salary, shortDate } from "../../lib/format";
import { Job } from "../../types/api";
import { SignalBadge } from "../../components/primitives/SignalBadge";

export function JobPreview({ job }: { job?: Job }) {
  if (!job) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-[#252b34] bg-[#090b0e] p-6 text-sm text-slate-400">
        Select an evidence row to inspect the source posting signal.
      </div>
    );
  }
  return (
    <aside className="sticky top-6 h-[calc(100vh-3rem)] overflow-y-auto rounded-[1.5rem] border border-[#20242b] bg-[#0b0d10] p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Evidence preview</p>
      <h2 className="mt-4 text-xl font-semibold text-slate-100">{job.raw_title ?? job.normalized_title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">Normalized role: {job.normalized_role}</p>
      <div className="mt-4 grid gap-2 text-sm">
        <PreviewFact label="Raw title" value={job.raw_title ?? "N/A"} />
        <PreviewFact label="Confidence" value={job.classification_confidence} />
        <PreviewFact label="Raw salary" value={job.raw_salary ?? "N/A"} />
        <PreviewFact label="Salary" value={salary(job.salary_min, job.salary_max, job.currency)} />
        <PreviewFact label="Seniority" value={job.seniority} />
        <PreviewFact label="Source" value={job.source} />
        <PreviewFact label="Posted" value={shortDate(job.posted_at)} />
      </div>
      <div className="mt-5 rounded-2xl border border-[#20242b] bg-[#07090b] p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Why this label</p>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-400">
          {job.classification_notes.map((note) => <li key={note}>{note}</li>)}
        </ul>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">{job.skills.slice(0, 10).map((skill) => <SignalBadge key={skill.id}>{skill.name}</SignalBadge>)}</div>
      {job.job_url && <a className="mt-5 inline-flex text-sm font-medium text-slate-100 underline-offset-4 hover:underline" href={job.job_url} target="_blank" rel="noreferrer">Open source posting</a>}
    </aside>
  );
}

function PreviewFact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3 border-b border-[#20242b] pb-2">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-200">{value}</span>
    </div>
  );
}
