import { CountItem, Overview } from "../../types/api";
import { SignalBadge } from "../../components/primitives/SignalBadge";

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
      <SignalLane title="Role demand lane" caption="Where job volume clusters" items={roles.slice(0, 5)} />
      <SignalLane title="Skill demand lane" caption="What clean postings ask for" items={skills.slice(0, 5)} />
      <SignalLane title="Access lane" caption="Remote, hybrid and onsite mix" items={modes.slice(0, 5)} />
      <div className="rounded-[1.25rem] border border-[#20242b] bg-[#07090b] p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Confidence lane</p>
        <h3 className="mt-2 text-lg font-semibold text-slate-100">Data quality and freshness</h3>
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

function SignalLane({ title, caption, items }: { title: string; caption: string; items: CountItem[] }) {
  const max = Math.max(...items.map((item) => item.count), 1);
  return (
    <div className="rounded-[1.25rem] border border-[#20242b] bg-[#07090b] p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{title}</p>
      <h3 className="mt-2 text-lg font-semibold text-slate-100">{caption}</h3>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <div key={item.name}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
              <span className="truncate font-medium text-slate-200">{item.name}</span>
              <span className="text-slate-500">{item.percentage}%</span>
            </div>
            <div className="h-2 rounded-full bg-[#050608]">
              <div className="h-full rounded-full bg-slate-300" style={{ width: `${(item.count / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfidenceFact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#20242b] pb-2 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-100">{value}</span>
    </div>
  );
}
