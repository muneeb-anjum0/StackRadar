import { Overview } from "../../types/api";
import { SignalBadge } from "../../components/primitives/SignalBadge";
import { GlowPanel } from "../../components/ui/GlowPanel";

export function MarketThesis({ data }: { data: Overview }) {
  const role = data.most_common_role ?? "Unknown role";
  const skill = data.most_demanded_skill ?? "Unknown skill";
  return (
    <GlowPanel tone="cyan">
      <div className="relative overflow-hidden rounded-[1.5rem] p-7 md:p-8">
        <div className="absolute right-6 top-6 hidden h-36 w-36 rounded-full border border-cyan-200/15 md:block" />
        <div className="absolute right-14 top-14 hidden h-20 w-20 rounded-full border border-violet-300/20 md:block" />
        <div className="relative">
          <div className="flex flex-wrap gap-2">
            <SignalBadge tone="strong">Market thesis</SignalBadge>
            <SignalBadge>{data.total_jobs} usable jobs</SignalBadge>
            <SignalBadge>{data.remote_job_percentage}% remote</SignalBadge>
          </div>
          <h2 className="mt-8 max-w-5xl text-3xl font-semibold leading-tight tracking-normal text-neutral-50 md:text-5xl">
            {role} is the strongest role cluster. {skill} is the skill signal to watch.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-400">
            StackRadar reads role demand, skill pull, access and data trust as one market snapshot so the next move is visible without digging through reports.
          </p>
          <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
            <ThesisFact label="Top role" value={role} />
            <ThesisFact label="Top skill" value={skill} />
            <ThesisFact label="Quality" value={`${data.data_quality_score}%`} />
          </div>
        </div>
      </div>
    </GlowPanel>
  );
}

function ThesisFact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#111111] p-3">
      <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-600">{label}</p>
      <p className="mt-2 truncate text-sm font-semibold text-neutral-100">{value}</p>
    </div>
  );
}
