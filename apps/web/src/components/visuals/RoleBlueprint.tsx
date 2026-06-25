import { salary } from "../../lib/format";
import { RoleAnalytics } from "../../types/api";
import { SignalBadge } from "../primitives/SignalBadge";

export function RoleBlueprint({ role }: { role: RoleAnalytics }) {
  const core = role.top_skills.slice(0, 5);
  const support = role.top_skills.slice(5, 11);
  const salarySignal = role.salary_min && role.salary_max ? salary(role.salary_min, role.salary_max) : "Limited salary signal";
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
      <div className="rounded-[1.5rem] border border-[#20242b] bg-[#07090b] p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Core stack</p>
        <div className="mt-5 grid gap-3">
          {core.map((skill) => (
            <div key={skill.name} className="flex items-center justify-between border-b border-[#20242b] pb-3">
              <span className="font-medium text-slate-100">{skill.name}</span>
              <span className="text-sm text-slate-500">{skill.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <BlueprintFact label="Clean postings" value={role.total_jobs} />
        <BlueprintFact label={salarySignal === "Limited salary signal" ? "Limited salary signal" : "Salary signal"} value={salarySignal} />
        <BlueprintFact label="Work mode" value={role.common_work_modes[0]?.name ?? "Unknown"} />
        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Support stack</p>
        <div className="flex flex-wrap gap-2">
          {support.map((skill) => <SignalBadge key={skill.name}>{skill.name}</SignalBadge>)}
        </div>
      </div>
    </div>
  );
}

function BlueprintFact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#20242b] bg-[#07090b] p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-100">{value}</p>
    </div>
  );
}
