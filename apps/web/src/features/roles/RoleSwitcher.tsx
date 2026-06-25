export function RoleSwitcher({ role, roles, onRole }: { role: string; roles: string[]; onRole: (role: string) => void }) {
  return (
    <div className="rounded-[1.25rem] border border-[#20242b] bg-[#0b0d10] p-3">
      <p className="mb-3 px-1 text-xs uppercase tracking-[0.16em] text-slate-500">Role switcher</p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {roles.map((item) => (
          <button
            key={item}
            onClick={() => onRole(item)}
            className={`shrink-0 rounded-xl border px-3 py-2 text-sm font-medium ${role === item ? "border-[#3a404a] bg-[#151a20] text-white" : "border-[#252b34] bg-[#07090b] text-slate-400 hover:bg-[#101318] hover:text-slate-100"}`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
