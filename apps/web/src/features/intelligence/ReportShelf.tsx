import { AiReport } from "../../types/api";
import { EmptyPanel } from "../../components/primitives/EmptyPanel";
import { SignalBadge } from "../../components/primitives/SignalBadge";
import { AnimatedList, AnimatedListItem } from "../../components/reactbits/AnimatedList/AnimatedList";

export function ReportShelf({ reports, activeId, onSelect }: { reports: AiReport[]; activeId?: number; onSelect: (report: AiReport) => void }) {
  if (!reports.length) return <EmptyPanel title="No reports yet." body="Generate a manual brief from Fit Lens to populate this shelf." />;
  return (
    <aside className="rounded-[1.5rem] border border-white/[0.08] bg-[#151515] p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">Report library</p>
      <AnimatedList className="mt-4 grid gap-2">
        {reports.map((report) => (
          <AnimatedListItem key={report.id}>
            <button
              onClick={() => onSelect(report)}
              className={`w-full rounded-2xl border p-3 text-left ${activeId === report.id ? "border-violet-200/30 bg-[#1c1c1c]" : "border-white/[0.08] bg-[#111111] hover:bg-[#181818]"}`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold capitalize text-neutral-100">{report.report_type.replace(/_/g, " ")}</p>
                <SignalBadge tone={report.provider === "openrouter" ? "warn" : "neutral"}>{report.provider}</SignalBadge>
              </div>
              <p className="mt-2 truncate text-xs text-neutral-500">{report.target_role}</p>
              <p className="mt-1 text-xs text-neutral-500">{new Date(report.created_at).toLocaleString()}</p>
            </button>
          </AnimatedListItem>
        ))}
      </AnimatedList>
    </aside>
  );
}
