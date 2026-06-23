export type Page = "overview" | "skills" | "roles" | "gap" | "quality" | "jobs";

const items = [
  { id: "overview", label: "Overview" },
  { id: "skills", label: "Skills" },
  { id: "roles", label: "Roles" },
  { id: "gap", label: "Skill Gap" },
  { id: "quality", label: "Quality" },
  { id: "jobs", label: "Jobs" }
] as const;

export function Sidebar({ page, onChange }: { page: Page; onChange: (page: Page) => void }) {
  return (
    <aside className="rounded-2xl border border-slate-200/80 bg-white/85 p-4 shadow-[0_22px_60px_rgba(15,23,42,0.09)] backdrop-blur-xl lg:sticky lg:top-8">
      <div className="mb-7 px-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold tracking-normal text-slate-950">StackRadar</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">Local intelligence dashboard</p>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600">
            Local MVP
          </span>
        </div>
      </div>
      <nav className="grid gap-1 sm:grid-cols-3 lg:block lg:space-y-1">
        {items.map((item) => {
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
      </nav>
    </aside>
  );
}
