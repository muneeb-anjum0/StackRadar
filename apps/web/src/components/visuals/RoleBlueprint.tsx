import { salary } from "../../lib/format";
import { RoleAnalytics } from "../../types/api";
import { SignalBadge } from "../primitives/SignalBadge";

export function RoleBlueprint({ role }: { role: RoleAnalytics }) {
  const core = role.top_skills.slice(0, 4);
  const support = role.top_skills.slice(4, 9);
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
      <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/65 p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Core requirements</p>
        <div className="mt-5 grid gap-3">
          {core.map((skill) => (
            <div key={skill.name} className="flex items-center justify-between border-b border-slate-200/70 pb-3">
              <span className="font-medium text-slate-950">{skill.name}</span>
              <span className="text-sm text-slate-500">{skill.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <BlueprintFact label="Clean postings" value={role.total_jobs} />
        <BlueprintFact label="Salary signal" value={salary(role.salary_min, role.salary_max)} />
        <BlueprintFact label="Work mode" value={role.common_work_modes[0]?.name ?? "Unknown"} />
        <div className="flex flex-wrap gap-2">
          {support.map((skill) => <SignalBadge key={skill.name}>{skill.name}</SignalBadge>)}
        </div>
      </div>
    </div>
  );
}

function BlueprintFact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white/70 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-slate-950">{value}</p>
    </div>
  );
}
