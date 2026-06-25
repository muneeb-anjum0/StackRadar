import { AiReport } from "../../types/api";
import { SignalBadge } from "../primitives/SignalBadge";

export function ReportCard({ report, onClick }: { report: AiReport; onClick: (report: AiReport) => void }) {
  return (
    <button onClick={() => onClick(report)} className="w-full rounded-2xl border border-[#252b34] bg-[#090b0e] p-4 text-left hover:border-[#343b46] hover:bg-[#101318]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold capitalize text-slate-100">{report.report_type.replace(/_/g, " ")}</p>
        <SignalBadge tone={report.provider === "openrouter" ? "warn" : "neutral"}>{report.provider}</SignalBadge>
      </div>
      <p className="mt-2 text-xs text-slate-500">{report.target_role} / {new Date(report.created_at).toLocaleString()}</p>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">{report.output_text}</p>
    </button>
  );
}
