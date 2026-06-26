import { CountItem, Overview } from "../../types/api";
import { SignalBadge } from "../../components/primitives/SignalBadge";
import { SignalLane } from "../../components/ui/SignalLane";

export function MarketSignalBoard({
  roles,
  skills,
  modes,
  overview
}: {
  roles: CountItem[];
  skills: CountItem[];
  modes: CountItem[];
  overview: Overview;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      <SignalLane title="Role demand lane" caption="Where job volume clusters" items={roles.slice(0, 6)} tone="violet" />
      <SignalLane title="Skill demand lane" caption="What clean postings ask for" items={skills.slice(0, 6)} tone="cyan" />
      <SignalLane title="Access lane" caption="Remote, hybrid and onsite mix" items={modes.slice(0, 6)} tone="green" />
      <div className="rounded-[1.25rem] border border-white/[0.08] bg-[#151515] p-4">
        <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">Confidence lane</p>
        <h3 className="mt-2 text-lg font-semibold text-neutral-100">Data quality and freshness</h3>
        <div className="mt-5 grid gap-3">
          <ConfidenceFact label="Quality score" value={`${overview.data_quality_score}%`} />
          <ConfidenceFact label="Usable jobs" value={overview.total_jobs} />
          <ConfidenceFact label="Remote access" value={`${overview.remote_job_percentage}%`} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <SignalBadge tone={overview.data_quality_score >= 80 ? "good" : "warn"}>{overview.data_quality_score >= 80 ? "High trust" : "Needs review"}</SignalBadge>
          <SignalBadge>Local-first data</SignalBadge>
        </div>
      </div>
    </div>
  );
}

function ConfidenceFact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-2 text-sm">
      <span className="text-neutral-500">{label}</span>
      <span className="font-semibold text-neutral-100">{value}</span>
    </div>
  );
}
