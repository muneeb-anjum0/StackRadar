import { Overview } from "../../types/api";
import { SignalBadge } from "../../components/primitives/SignalBadge";

export function MarketThesis({ data }: { data: Overview }) {
  const role = data.most_common_role ?? "Unknown role";
  const skill = data.most_demanded_skill ?? "Unknown skill";
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white/92 p-8 shadow-[0_35px_100px_rgba(15,23,42,0.10)]">
      <div className="flex flex-wrap gap-2">
        <SignalBadge tone="strong">Market thesis</SignalBadge>
        <SignalBadge>{data.total_jobs} clean jobs</SignalBadge>
      </div>
      <h2 className="mt-8 max-w-4xl text-3xl font-semibold leading-tight tracking-normal text-slate-950 md:text-5xl">
        {role} is the strongest role cluster, and {skill} is the clearest skill pressure signal.
      </h2>
      <p className="mt-5 max-w-2xl text-base leading-7 text-slate-500">
        Based on the current StackRadar dataset, the market is most useful as a directional local signal: role demand, skill demand, remote access and data quality in one reading.
      </p>
    </div>
  );
}
