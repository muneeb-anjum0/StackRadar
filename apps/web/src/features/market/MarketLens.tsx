import { LensHeader } from "../../components/shell/LensHeader";
import { Surface } from "../../components/primitives/Surface";
import { LoadingPanel } from "../../components/primitives/LoadingPanel";
import { SignalMap } from "../../components/visuals/SignalMap";
import { useMarketData } from "../../hooks/useMarketData";
import { compactNumber } from "../../lib/format";
import { MarketThesis } from "./MarketThesis";
import { SourceLedger } from "./SourceLedger";

export function MarketLens() {
  const { overview, skills, roles, sources } = useMarketData();
  if (overview.isLoading) return <LoadingPanel label="Reading market signals" />;
  const data = overview.data;
  if (!data) return null;

  return (
    <div className="space-y-7">
      <LensHeader
        eyebrow="Market Lens"
        title="The strongest signal right now"
        subtitle="A quieter market canvas that connects roles, skills, access and source health without repeating the same metrics three times."
      />
      <MarketThesis data={data} />
      <div className="grid gap-4 md:grid-cols-3">
        <SignalStrip label="Top role" value={data.most_common_role ?? "Unknown"} detail={`${roles.data?.[0]?.percentage ?? 0}% of role demand`} />
        <SignalStrip label="Top skill" value={data.most_demanded_skill ?? "Unknown"} detail={`${skills.data?.[0]?.count ?? 0} mentions`} />
        <SignalStrip label="Remote share" value={`${data.remote_job_percentage}%`} detail={`Average salary ${compactNumber(data.average_salary)}`} />
      </div>
      <Surface level={3} className="p-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Signal map</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Roles and skills in the same reading</h2>
          </div>
          <p className="hidden max-w-sm text-right text-sm leading-6 text-slate-500 md:block">Ranked lanes connect the role clusters to the skills creating the strongest pressure.</p>
        </div>
        <SignalMap roles={roles.data ?? []} skills={skills.data ?? []} />
      </Surface>
      <SourceLedger sources={sources.data} />
    </div>
  );
}

function SignalStrip({ label, value, detail }: { label: string; value: React.ReactNode; detail: string }) {
  return (
    <div className="rounded-[1.35rem] border border-slate-200 bg-white/76 p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-3 truncate text-xl font-semibold text-slate-950">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{detail}</p>
    </div>
  );
}
