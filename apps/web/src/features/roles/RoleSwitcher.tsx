import { SelectField } from "../../components/primitives/SelectField";

export function RoleSwitcher({ role, roles, onRole }: { role: string; roles: string[]; onRole: (role: string) => void }) {
  return (
    <div className="rounded-[1.35rem] border border-slate-200 bg-white/76 p-4">
      <p className="mb-2 text-xs uppercase tracking-[0.16em] text-slate-400">Lens switcher</p>
      <SelectField value={role} onChange={(event) => onRole(event.target.value)} options={roles} className="w-full" />
    </div>
  );
}
