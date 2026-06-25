import { useState } from "react";
import { Page } from "./types";

const groups: { title: string; items: { id: Page; label: string; short: string; helper: string }[] }[] = [
  {
    title: "Intelligence",
    items: [
      { id: "overview", label: "Market", short: "M", helper: "overall market signal" },
      { id: "skills", label: "Skills", short: "S", helper: "demand by skill" },
      { id: "roles", label: "Roles", short: "R", helper: "role requirement blueprint" },
      { id: "jobs", label: "Jobs", short: "J", helper: "evidence behind signals" }
    ]
  },
  {
    title: "Personal",
    items: [
      { id: "gap", label: "Career Plan", short: "CP", helper: "personal next move" },
      { id: "intelligence", label: "AI Reports", short: "AI", helper: "generated briefs" }
    ]
  },
  {
    title: "System",
    items: [{ id: "quality", label: "Pipeline", short: "P", helper: "data trust center" }]
  }
];

export function LensRail({
  page,
  onPage,
  cleanJobs,
  quality,
  aiProvider
}: {
  page: Page;
  onPage: (page: Page) => void;
  cleanJobs?: number;
  quality?: number;
  aiProvider?: string;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sticky top-0 z-20 h-screen shrink-0 border-r border-[#20242b] bg-[#050608] p-3 ${collapsed ? "w-[76px]" : "w-[304px]"}`}>
      <div className={`flex h-full flex-col overflow-hidden rounded-[1.1rem] border border-[#20242b] bg-[#080a0d] p-3 ${collapsed ? "items-center" : ""}`}>
        <div className={`flex w-full items-start gap-3 px-2 pb-5 ${collapsed ? "justify-center" : "justify-between"}`}>
          <div className={`min-w-0 ${collapsed ? "text-center" : ""}`}>
            {!collapsed && (
              <div>
                <p className="text-[15px] font-semibold tracking-tight text-white">StackRadar</p>
                <p className="mt-1 text-[11px] leading-4 text-slate-400">Career intelligence from job-market data</p>
              </div>
            )}
          </div>
          {!collapsed && <button className="rounded-lg border border-[#252b34] px-2 py-1 text-xs text-slate-400 hover:bg-[#101318] hover:text-white" onClick={() => setCollapsed(true)}>Collapse</button>}
        </div>
        <nav className="grid w-full gap-5 overflow-y-auto pr-1">
          {groups.map((group) => (
            <div key={group.title}>
              {!collapsed && <p className="mb-2 px-2 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">{group.title}</p>}
              <div className="grid gap-1.5">
                {group.items.map((lens) => {
                  const active = page === lens.id;
                  return (
                    <button
                      key={lens.id}
                      title={collapsed ? `${lens.label}: ${lens.helper}` : undefined}
                      onClick={() => onPage(lens.id)}
                      className={`group relative grid min-h-[52px] items-center rounded-xl border text-left ${
                        collapsed ? "justify-items-center px-2" : "grid-cols-[1fr_auto] gap-3 px-3"
                      } ${
                        active
                          ? "border-[#3a404a] bg-[#151a20] text-white"
                          : "border-transparent text-slate-400 hover:border-[#252b34] hover:bg-[#101318] hover:text-slate-100"
                      }`}
                    >
                      {collapsed ? (
                        <span className="text-xs font-semibold tracking-normal">{lens.short}</span>
                      ) : (
                        <>
                          <span className="min-w-0">
                            <span className="block text-sm font-medium">{lens.label}</span>
                            <span className={`mt-0.5 block truncate text-[11px] ${active ? "text-slate-300" : "text-slate-500 group-hover:text-slate-400"}`}>{lens.helper}</span>
                          </span>
                          <span className={`h-2 w-2 rounded-full ${active ? "bg-slate-200" : "bg-slate-700"}`} />
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className={`mt-auto w-full border-t border-[#20242b] pt-3 ${collapsed ? "text-center" : ""}`}>
          <div className={`rounded-2xl border border-[#20242b] bg-[#050608] p-3 ${collapsed ? "grid justify-items-center gap-2" : ""}`}>
            {!collapsed && <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-slate-500">System status</p>}
            <StatusLine collapsed={collapsed} label="Clean jobs" value={cleanJobs ?? "..."} />
            <StatusLine collapsed={collapsed} label="Quality" value={quality !== undefined ? `${quality}%` : "..."} />
            <StatusLine collapsed={collapsed} label="AI provider" value={aiProvider ?? "..."} />
          </div>
          {collapsed && <button className="mt-3 rounded-lg border border-[#252b34] px-2 py-1 text-xs text-slate-400 hover:bg-[#101318] hover:text-white" onClick={() => setCollapsed(false)}>Open</button>}
        </div>
      </div>
    </aside>
  );
}

function StatusLine({ label, value, collapsed }: { label: string; value: React.ReactNode; collapsed: boolean }) {
  if (collapsed) {
    return <span title={`${label}: ${value}`} className="h-2.5 w-2.5 rounded-full bg-slate-300/80" />;
  }
  return (
    <div className="flex items-center justify-between gap-3 py-1 text-xs">
      <span className="text-slate-500">{label}</span>
      <span className="max-w-[130px] truncate font-medium text-slate-200">{value}</span>
    </div>
  );
}
