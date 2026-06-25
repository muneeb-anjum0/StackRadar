import { AiReport } from "../../types/api";
import { EmptyPanel } from "../../components/primitives/EmptyPanel";
import { SignalBadge } from "../../components/primitives/SignalBadge";

export function ReportShelf({ reports, activeId, onSelect }: { reports: AiReport[]; activeId?: number; onSelect: (report: AiReport) => void }) {
  if (!reports.length) return <EmptyPanel title="No reports yet." body="Generate a manual brief from Fit Lens to populate this shelf." />;
  return (
    <aside className="rounded-[1.5rem] border border-[#20242b] bg-[#0b0d10] p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Report library</p>
      <div className="mt-4 grid gap-2">
        {reports.map((report) => (
          <button
            key={report.id}
            onClick={() => onSelect(report)}
            className={`rounded-2xl border p-3 text-left ${activeId === report.id ? "border-[#3a404a] bg-[#151a20]" : "border-[#252b34] bg-[#090b0e] hover:bg-[#101318]"}`}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold capitalize text-slate-100">{report.report_type.replace(/_/g, " ")}</p>
              <SignalBadge tone={report.provider === "openrouter" ? "warn" : "neutral"}>{report.provider}</SignalBadge>
            </div>
            <p className="mt-2 truncate text-xs text-slate-500">{report.target_role}</p>
            <p className="mt-1 text-xs text-slate-500">{new Date(report.created_at).toLocaleString()}</p>
          </button>
        ))}
      </div>
    </aside>
  );
}
