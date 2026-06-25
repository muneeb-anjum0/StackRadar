import { useMemo, useState } from "react";
import { LensHeader } from "../../components/shell/LensHeader";
import { Surface } from "../../components/primitives/Surface";
import { LoadingPanel } from "../../components/primitives/LoadingPanel";
import { useMarketData } from "../../hooks/useMarketData";
import { MarketThesis } from "./MarketThesis";
import { MarketSignalBoard } from "./MarketSignalBoard";
import { SourceLedger } from "./SourceLedger";

const scopes = ["Software only", "All roles", "Data/AI", "Backend", "Frontend", "Remote only", "Junior friendly"];
const roleTerms: Record<string, string[]> = {
  "Software only": ["developer", "engineer", "software", "frontend", "backend", "full", "data", "ai", "qa", "mobile", "devops", "cloud"],
  "Data/AI": ["data", "ai", "machine", "ml", "analytics"],
  Backend: ["backend", "back end", "api", "platform"],
  Frontend: ["frontend", "front end", "react", "ui"],
  "Junior friendly": ["junior", "entry", "intern"]
};

export function MarketLens() {
  const [scope, setScope] = useState("Software only");
  const { overview, skills, roles, modes, sources } = useMarketData();
  const scopedRoles = useMemo(() => {
    const allRoles = roles.data ?? [];
    if (scope === "All roles" || scope === "Remote only") return allRoles;
    const terms = roleTerms[scope] ?? roleTerms["Software only"];
    const filtered = allRoles.filter((item) => terms.some((term) => item.name.toLowerCase().includes(term)));
    return filtered.length ? filtered : allRoles;
  }, [roles.data, scope]);
  if (overview.isLoading) return <LoadingPanel label="Reading market signals" />;
  const data = overview.data;
  if (!data) return null;

  return (
    <div className="space-y-7">
      <LensHeader
        eyebrow="Market Lens"
        title="Market"
        subtitle="See the strongest role, skill and access signals in the current dataset."
      />
      <div className="flex flex-wrap gap-2">
        {scopes.map((item) => (
          <button
            key={item}
            onClick={() => setScope(item)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${scope === item ? "border-slate-300/30 bg-white/[0.12] text-white" : "border-white/[0.08] bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-slate-100"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <MarketThesis data={data} />
      <Surface level={3} className="p-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Market Signal Board</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-100">What the current job market is asking for</h2>
          </div>
          <p className="hidden max-w-sm text-right text-sm leading-6 text-slate-400 md:block">Read role demand, skill demand, access and trust as connected lanes, not isolated cards.</p>
        </div>
        <MarketSignalBoard roles={scopedRoles} skills={skills.data ?? []} modes={modes.data ?? []} overview={data} />
      </Surface>
      <SourceLedger sources={sources.data} />
    </div>
  );
}
