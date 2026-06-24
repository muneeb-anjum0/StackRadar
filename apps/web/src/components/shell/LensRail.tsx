import { Page } from "./types";

const lenses: { id: Page; label: string; helper: string }[] = [
  { id: "overview", label: "Market", helper: "signals" },
  { id: "skills", label: "Skills", helper: "pressure" },
  { id: "roles", label: "Roles", helper: "blueprint" },
  { id: "jobs", label: "Jobs", helper: "evidence" },
  { id: "gap", label: "Fit", helper: "personal" },
  { id: "intelligence", label: "AI Briefs", helper: "manual" },
  { id: "quality", label: "Pipeline", helper: "trust" }
];

export function LensRail({ page, onPage, cleanJobs, quality }: { page: Page; onPage: (page: Page) => void; cleanJobs?: number; quality?: number }) {
  return (
    <aside className="sticky top-6 z-20 h-[calc(100vh-3rem)] overflow-y-auto rounded-[1.35rem] border border-slate-200 bg-white p-3 shadow-sm">
      <div className="px-2 pb-4">
        <p className="text-[15px] font-semibold tracking-tight text-slate-950">StackRadar</p>
        <p className="mt-0.5 text-[11px] text-slate-400">career console</p>
      </div>
      <nav className="grid gap-1">
        {lenses.map((lens) => {
          const active = page === lens.id;
          return (
            <button
              key={lens.id}
              onClick={() => onPage(lens.id)}
              className={`group grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition duration-200 ${
                active
                  ? "border-slate-200 bg-slate-950 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
                  : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-white hover:text-slate-950"
              }`}
            >
              <span className="text-sm font-medium">{lens.label}</span>
              <span className={`text-[10px] ${active ? "text-slate-300" : "text-slate-400 group-hover:text-slate-500"}`}>{lens.helper}</span>
            </button>
          );
        })}
      </nav>
      <div className="mt-5 border-t border-slate-100 px-2 pt-3 text-[11px] leading-5 text-slate-500">
        <p>Local graph</p>
        <p>{cleanJobs ?? "..."} clean jobs</p>
        <p>{quality ?? "..."}% quality</p>
      </div>
    </aside>
  );
}
