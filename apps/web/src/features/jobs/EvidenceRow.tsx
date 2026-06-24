import { salary, shortDate } from "../../lib/format";
import { Job } from "../../types/api";
import { SignalBadge } from "../../components/primitives/SignalBadge";

export function EvidenceRow({ job, selected, onSelect }: { job: Job; selected: boolean; onSelect: (job: Job) => void }) {
  return (
    <button
      onClick={() => onSelect(job)}
      className={`grid w-full gap-4 rounded-2xl border p-4 text-left transition md:grid-cols-[1fr_170px] ${
        selected ? "border-slate-400 bg-white shadow-md" : "border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white"
      }`}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <SignalBadge tone="strong">{job.normalized_role}</SignalBadge>
          <SignalBadge>{job.source}</SignalBadge>
          <SignalBadge>{job.work_mode}</SignalBadge>
        </div>
        <h3 className="mt-3 truncate text-base font-semibold text-slate-950">{job.normalized_title}</h3>
        <p className="mt-1 text-sm text-slate-500">{job.company ?? "Unknown company"} / {[job.city, job.country].filter(Boolean).join(", ") || "Unknown location"}</p>
        <p className="mt-2 text-xs text-slate-400">Collected {shortDate(job.collected_at)}</p>
      </div>
      <div className="md:text-right">
        <p className="text-sm font-semibold text-slate-950">{salary(job.salary_min, job.salary_max, job.currency)}</p>
        <p className="mt-2 text-xs text-slate-400">{job.skills.slice(0, 3).map((skill) => skill.name).join(" / ") || "No skills extracted"}</p>
      </div>
    </button>
  );
}
