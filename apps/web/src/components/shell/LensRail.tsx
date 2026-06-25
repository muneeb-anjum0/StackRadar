import { useState } from "react";
import {
  BarChart3,
  Bot,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  Layers3,
  Route,
  Wrench
} from "lucide-react";
import { Page } from "./types";

const groups: {
  title: string;
  items: { id: Page; label: string; helper: string; icon: typeof BarChart3 }[];
}[] = [
  {
    title: "Intelligence",
    items: [
      { id: "overview", label: "Market", helper: "overall market signal", icon: BarChart3 },
      { id: "skills", label: "Skills", helper: "demand by skill", icon: Wrench },
      { id: "roles", label: "Roles", helper: "role requirement blueprint", icon: Layers3 },
      { id: "jobs", label: "Jobs", helper: "evidence behind signals", icon: BriefcaseBusiness }
    ]
  },
  {
    title: "Personal",
    items: [
      { id: "gap", label: "Career Plan", helper: "personal next move", icon: Route },
      { id: "intelligence", label: "AI Reports", helper: "generated briefs", icon: Bot }
    ]
  },
  {
    title: "System",
    items: [{ id: "quality", label: "Pipeline", helper: "data trust center", icon: GitBranch }]
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
    <aside className={`sticky top-0 z-20 h-screen shrink-0 bg-[#050608] p-3 pr-5 ${collapsed ? "w-[92px]" : "w-[304px]"}`}>
      <div className={`relative flex h-full flex-col overflow-visible rounded-[1.1rem] border border-[#20242b] bg-[#080a0d] p-3 ${collapsed ? "items-center" : ""}`}>
        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed((value) => !value)}
          className="absolute -right-5 top-7 grid h-10 w-10 place-items-center rounded-full border border-[#303743] bg-[#0b0f14] text-slate-200"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        <div className={`flex w-full items-start gap-3 px-2 pb-5 ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && <p className="text-[15px] font-semibold tracking-tight text-white">StackRadar</p>}
        </div>

        <nav className={`grid w-full gap-5 overflow-y-auto ${collapsed ? "justify-items-center px-1" : "pr-1"}`}>
          {groups.map((group) => (
            <div key={group.title} className={collapsed ? "w-full" : undefined}>
              {!collapsed && <p className="mb-2 px-2 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">{group.title}</p>}
              <div className={`grid gap-1.5 ${collapsed ? "justify-items-center" : ""}`}>
                {group.items.map((lens) => {
                  const active = page === lens.id;
                  const Icon = lens.icon;
                  return (
                    <button
                      key={lens.id}
                      title={collapsed ? `${lens.label}: ${lens.helper}` : undefined}
                      aria-label={collapsed ? lens.label : undefined}
                      onClick={() => onPage(lens.id)}
                      className={`group relative grid items-center rounded-xl border text-left ${
                        collapsed ? "h-11 w-11 justify-items-center" : "min-h-[52px] grid-cols-[1fr_auto] gap-3 px-3"
                      } ${
                        active
                          ? "border-[#3a404a] bg-[#151a20] text-white"
                          : "border-transparent text-slate-400 hover:border-[#252b34] hover:bg-[#101318] hover:text-slate-100"
                      }`}
                    >
                      {collapsed ? (
                        <Icon className="h-4 w-4" />
                      ) : (
                        <>
                          <span className="flex min-w-0 items-center gap-3">
                            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border ${active ? "border-[#3a404a] bg-[#0b0f14] text-slate-100" : "border-[#252b34] bg-[#07090c] text-slate-500 group-hover:text-slate-200"}`}>
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-medium">{lens.label}</span>
                              <span className={`mt-0.5 block truncate text-[11px] ${active ? "text-slate-300" : "text-slate-500 group-hover:text-slate-400"}`}>{lens.helper}</span>
                            </span>
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
