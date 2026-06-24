import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { Overview } from "../../types/api";
import { FloatingRail } from "../workspace/FloatingRail";

export type Page = "overview" | "skills" | "roles" | "gap" | "intelligence" | "quality" | "jobs";

const groups = [
  { label: "Workspace", items: [{ id: "overview", label: "Overview" }, { id: "skills", label: "Skills" }, { id: "roles", label: "Roles" }, { id: "jobs", label: "Jobs" }] },
  { label: "Personal", items: [{ id: "gap", label: "Skill Gap" }, { id: "intelligence", label: "Intelligence" }] },
  { label: "System", items: [{ id: "quality", label: "Data Quality" }] }
] as const;

export function Sidebar({ page, onChange }: { page: Page; onChange: (page: Page) => void }) {
  const overview = useQuery({ queryKey: ["overview"], queryFn: () => api.get<Overview>("/analytics/overview") });

  return (
    <FloatingRail>
      <div className="hidden px-2 pb-5 lg:block">
        <p className="text-lg font-semibold tracking-normal text-slate-950">StackRadar</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">market intelligence</p>
      </div>
      <nav className="grid flex-1 gap-3 sm:grid-cols-3 lg:block lg:space-y-5">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-1 hidden px-3 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400 lg:block">
              {group.label}
            </p>
            <div className="grid gap-1 sm:grid-cols-2 lg:block lg:space-y-1">
              {group.items.map((item) => {
                const active = page === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onChange(item.id)}
                    className={`w-full rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition ${
                      active
                        ? "border-slate-200 bg-slate-100 text-slate-950 shadow-sm"
                        : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
        </div>
        ))}
      </nav>
      <div className="mt-5 hidden rounded-2xl border border-slate-200 bg-slate-50 p-3 lg:block">
        <p className="text-xs font-semibold text-slate-900">Local MVP</p>
        <p className="mt-2 text-xs text-slate-500">{overview.data?.total_jobs ?? "..."} clean jobs</p>
        <p className="mt-1 text-xs text-slate-500">{overview.data?.data_quality_score ?? "..."}% quality</p>
      </div>
    </FloatingRail>
  );
}
