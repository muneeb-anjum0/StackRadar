import { CountItem } from "../../types/api";

export function SignalMap({ roles, skills }: { roles: CountItem[]; skills: CountItem[] }) {
  const lanes = roles.slice(0, 6).map((role, index) => ({ role, skill: skills[index] }));
  return (
    <div className="grid gap-3">
      {lanes.map(({ role, skill }, index) => (
        <div key={role.name} className="grid items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 sm:grid-cols-[1fr_80px_1fr]">
          <SignalNode label={role.name} meta={`${role.count} roles`} align="left" />
          <div className="hidden h-px bg-gradient-to-r from-slate-200 via-slate-400 to-slate-200 sm:block" />
          <SignalNode label={skill?.name ?? "No skill"} meta={`${skill?.percentage ?? 0}% demand`} align={index % 2 ? "left" : "right"} />
        </div>
      ))}
    </div>
  );
}

function SignalNode({ label, meta, align }: { label: string; meta: string; align: "left" | "right" }) {
  return (
    <div className={align === "right" ? "text-right" : ""}>
      <p className="truncate text-sm font-semibold text-slate-950">{label}</p>
      <p className="mt-1 text-xs text-slate-400">{meta}</p>
    </div>
  );
}
