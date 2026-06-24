import { motion } from "framer-motion";
import { Badge } from "../ui/Badge";
import { AiReport } from "../../types/api";

function paragraphs(text: string) {
  return text.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
}

export function IntelligenceBrief({ report, loading, error }: { report?: AiReport | null; loading?: boolean; error?: string | null }) {
  return (
    <motion.section
      layout
      className="min-h-[420px] rounded-[1.5rem] border border-slate-200 bg-white/95 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Intelligence brief</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">{report ? label(report.report_type) : "Ready when you are"}</h2>
        </div>
        <div className="flex gap-2">
          {report && <Badge tone={report.provider === "gemini" ? "accent" : "neutral"}>{report.provider}</Badge>}
          {report?.reused_from_cache && <Badge tone="good">reused from cache</Badge>}
        </div>
      </div>
      <div className="mt-6">
        {loading && <BriefSkeleton />}
        {error && <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700">{error}</p>}
        {!loading && !error && report && (
          <div className="space-y-5">
            {paragraphs(report.output_text).map((part, index) => (
              <p key={index} className="whitespace-pre-line text-sm leading-7 text-slate-600">{part}</p>
            ))}
          </div>
        )}
        {!loading && !error && !report && (
          <p className="max-w-xl text-sm leading-7 text-slate-500">
            Run the deterministic skill-gap analysis first, then generate a manual AI brief. Mock mode is local and free; Gemini is opt-in only.
          </p>
        )}
      </div>
    </motion.section>
  );
}

function label(type: string) {
  return type.replace(/_/g, " ");
}

function BriefSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
      ))}
    </div>
  );
}
