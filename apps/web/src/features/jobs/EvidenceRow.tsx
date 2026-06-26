import { salary, shortDate } from "../../lib/format";
import { Job } from "../../types/api";
import { SignalBadge } from "../../components/primitives/SignalBadge";

export function EvidenceRow({ job, selected, onSelect }: { job: Job; selected: boolean; onSelect: (job: Job) => void }) {
  const confidenceTone = job.classification_confidence === "high" ? "good" : job.classification_confidence === "medium" ? "warn" : "danger";
  const confidenceLabel = job.classification_confidence === "high" ? "High confidence" : job.classification_confidence === "medium" ? "Medium confidence" : "Needs review";
  return (
    <button
      onClick={() => onSelect(job)}
      className={`grid w-full gap-4 rounded-[1.15rem] border p-4 text-left md:grid-cols-[1fr_190px] ${
        selected ? "border-cyan-200/30 bg-[#1c1c1c]" : "border-white/[0.08] bg-[#151515] hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-[#181818]"
      }`}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <SignalBadge tone="strong">{job.normalized_role}</SignalBadge>
          <SignalBadge tone={confidenceTone}>{confidenceLabel}</SignalBadge>
          <SignalBadge>{job.source}</SignalBadge>
          <SignalBadge>{job.work_mode}</SignalBadge>
        </div>
        <h3 className="mt-3 truncate text-base font-semibold text-neutral-100">{job.raw_title ?? job.normalized_title}</h3>
        <p className="mt-1 text-sm text-neutral-400">Normalized as {job.normalized_role} / {job.company ?? "Unknown company"} / {[job.city, job.country].filter(Boolean).join(", ") || "Unknown location"}</p>
        <p className="mt-2 text-xs text-neutral-500">Collected {shortDate(job.collected_at)}</p>
      </div>
      <div className="md:text-right">
        <p className="text-sm font-semibold text-neutral-100">{salary(job.salary_min, job.salary_max, job.currency)}</p>
        <p className="mt-2 text-xs text-neutral-500">{job.skills.slice(0, 4).map((skill) => skill.name).join(" / ") || "No skills extracted"}</p>
      </div>
    </button>
  );
}
