import { CountItem } from "../../types/api";

export function RoleCompareTray({ roles, selected }: { roles: CountItem[]; selected: string }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {roles.filter((role) => role.name !== selected).slice(0, 3).map((role) => (
        <div key={role.name} className="rounded-2xl border border-slate-200 bg-white/68 p-4">
          <p className="truncate text-sm font-semibold text-slate-950">{role.name}</p>
          <p className="mt-2 text-xs text-slate-400">{role.count} clean postings / {role.percentage}% share</p>
        </div>
      ))}
    </div>
  );
}
