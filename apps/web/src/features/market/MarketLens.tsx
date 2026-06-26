import { useMemo, useState } from "react";
import { LensHeader } from "../../components/shell/LensHeader";
import { Surface } from "../../components/primitives/Surface";
import { LoadingPanel } from "../../components/primitives/LoadingPanel";
import { useMarketData } from "../../hooks/useMarketData";
import { MarketThesis } from "./MarketThesis";
import { MarketSignalBoard } from "./MarketSignalBoard";
import { SourceLedger } from "./SourceLedger";
import { MetricTile } from "../../components/ui/MetricTile";
import { SectionHeader } from "../../components/ui/SectionHeader";

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
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${scope === item ? "border-[#3a404a] bg-[#151a20] text-white" : "border-[#252b34] bg-[#07090b] text-slate-400 hover:bg-[#101318] hover:text-slate-100"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <MarketThesis data={data} />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricTile label="Top role signal" value={data.most_common_role ?? "Unknown"} detail="Highest role cluster in clean postings" tone="violet" />
        <MetricTile label="Top skill signal" value={data.most_demanded_skill ?? "Unknown"} detail="Most repeated skill in evidence" tone="cyan" />
        <MetricTile label="Remote share" value={`${data.remote_job_percentage}%`} detail="Access signal across work modes" tone="green" />
        <MetricTile label="Average salary" value={data.average_salary ? `$${Math.round(data.average_salary).toLocaleString()}` : "N/A"} detail="Only where salary is visible" tone="neutral" />
      </div>
      <Surface level={3} className="p-6">
        <SectionHeader
          eyebrow="Market signal board"
          title="What the current job market is asking for"
          description="Read role demand, skill demand, access and trust as connected lanes, not isolated cards."
        />
        <MarketSignalBoard roles={scopedRoles} skills={skills.data ?? []} modes={modes.data ?? []} overview={data} />
      </Surface>
      <SourceLedger sources={sources.data} />
    </div>
  );
}
