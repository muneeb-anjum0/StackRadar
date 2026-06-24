import { AiReport } from "../../types/api";
import { Badge } from "../ui/Badge";

export function ReportHistoryShelf({ reports, onSelect }: { reports: AiReport[]; onSelect?: (report: AiReport) => void }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white/90 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-950">Report shelf</p>
        <span className="text-xs text-slate-400">{reports.length} latest</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {reports.map((report) => (
          <button
            key={report.id}
            onClick={() => onSelect?.(report)}
            className="min-w-64 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:border-slate-300 hover:bg-white"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-950">{report.report_type.replace(/_/g, " ")}</p>
              <Badge>{report.provider}</Badge>
            </div>
            <p className="mt-2 text-xs text-slate-500">{report.target_role}</p>
            <p className="mt-1 text-xs text-slate-400">{new Date(report.created_at).toLocaleString()}</p>
          </button>
        ))}
        {!reports.length && <p className="p-4 text-sm text-slate-500">No reports yet.</p>}
      </div>
    </div>
  );
}
