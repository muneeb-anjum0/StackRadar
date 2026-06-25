import { Overview } from "../../types/api";
import { SignalBadge } from "../../components/primitives/SignalBadge";

export function MarketThesis({ data }: { data: Overview }) {
  const role = data.most_common_role ?? "Unknown role";
  const skill = data.most_demanded_skill ?? "Unknown skill";
  return (
    <div className="rounded-[1.5rem] border border-[#242933] bg-[#0d1014] p-8">
      <div className="flex flex-wrap gap-2">
        <SignalBadge tone="strong">Market thesis</SignalBadge>
        <SignalBadge>{data.total_jobs} usable jobs</SignalBadge>
        <SignalBadge>{data.remote_job_percentage}% remote</SignalBadge>
      </div>
      <h2 className="mt-8 max-w-4xl text-3xl font-semibold leading-tight tracking-normal text-slate-50 md:text-5xl">
        {role} is the strongest role cluster, and {skill} is the clearest skill demand signal.
      </h2>
      <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">
        Based on the current StackRadar dataset, the market is most useful as a directional local signal: role demand, skill demand, remote access and data quality in one reading.
      </p>
    </div>
  );
}
