export function RoleSwitcher({ role, roles, onRole }: { role: string; roles: string[]; onRole: (role: string) => void }) {
  return (
    <div className="rounded-[1.35rem] border border-white/[0.08] bg-[#121418]/72 p-3">
      <p className="mb-3 px-1 text-xs uppercase tracking-[0.16em] text-slate-500">Role switcher</p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {roles.map((item) => (
          <button
            key={item}
            onClick={() => onRole(item)}
            className={`shrink-0 rounded-xl border px-3 py-2 text-sm font-medium transition ${role === item ? "border-slate-300/30 bg-white/[0.12] text-white" : "border-white/[0.08] bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-slate-100"}`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
