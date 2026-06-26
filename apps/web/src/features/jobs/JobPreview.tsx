import { salary, shortDate } from "../../lib/format";
import { Job } from "../../types/api";
import { SignalBadge } from "../../components/primitives/SignalBadge";

export function JobPreview({ job }: { job?: Job }) {
  if (!job) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-white/[0.12] bg-[#151515] p-6 text-sm text-neutral-400">
        Select an evidence row to inspect the source posting signal.
      </div>
    );
  }
  return (
    <aside className="premium-scroll sticky top-24 h-[calc(100vh-7rem)] overflow-y-auto rounded-[1.5rem] border border-white/[0.08] bg-[#151515] p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">Evidence preview</p>
      <h2 className="mt-4 text-xl font-semibold text-neutral-100">{job.raw_title ?? job.normalized_title}</h2>
      <p className="mt-2 text-sm leading-6 text-neutral-400">Normalized role: {job.normalized_role}</p>
      <div className="mt-4 grid gap-2 text-sm">
        <PreviewFact label="Raw title" value={job.raw_title ?? "N/A"} />
        <PreviewFact label="Confidence" value={job.classification_confidence} />
        <PreviewFact label="Raw salary" value={job.raw_salary ?? "N/A"} />
        <PreviewFact label="Salary" value={salary(job.salary_min, job.salary_max, job.currency)} />
        <PreviewFact label="Seniority" value={job.seniority} />
        <PreviewFact label="Source" value={job.source} />
        <PreviewFact label="Posted" value={shortDate(job.posted_at)} />
      </div>
      <div className="mt-5 rounded-2xl border border-white/[0.08] bg-[#111111] p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">Why this label</p>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-400">
          {job.classification_notes.map((note) => <li key={note}>{note}</li>)}
        </ul>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">{job.skills.slice(0, 10).map((skill) => <SignalBadge key={skill.id}>{skill.name}</SignalBadge>)}</div>
      {job.job_url && <a className="mt-5 inline-flex text-sm font-medium text-cyan-100 underline-offset-4 hover:underline" href={job.job_url} target="_blank" rel="noreferrer">Open source posting</a>}
    </aside>
  );
}

function PreviewFact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3 border-b border-white/[0.08] pb-2">
      <span className="text-neutral-500">{label}</span>
      <span className="text-right font-medium text-neutral-200">{value}</span>
    </div>
  );
}
