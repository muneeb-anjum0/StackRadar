import { ReportType } from "../../types/api";

export const reportTypes: { type: ReportType; label: string; helper: string }[] = [
  { type: "career_report", label: "Career Report", helper: "fit, gaps, and next moves" },
  { type: "learning_roadmap", label: "4-Week Roadmap", helper: "weekly learning plan" },
  { type: "project_suggestions", label: "Project Suggestions", helper: "portfolio ideas" },
  { type: "role_fit", label: "Role Fit", helper: "evidence-based explanation" },
  { type: "skill_gap_brief", label: "Skill Gap Brief", helper: "short priority memo" }
];

export function ReportTypePicker({
  onPick,
  disabled,
  activeType
}: {
  onPick: (type: ReportType) => void;
  disabled?: boolean;
  activeType?: ReportType | null;
}) {
  return (
    <div className="grid gap-2 md:grid-cols-5">
      {reportTypes.map((item) => (
        <button
          key={item.type}
          disabled={disabled}
          onClick={() => onPick(item.type)}
          className="min-h-24 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="block text-sm font-semibold text-slate-950">{activeType === item.type ? "Generating..." : item.label}</span>
          <span className="mt-2 block text-xs leading-5 text-slate-500">{item.helper}</span>
        </button>
      ))}
    </div>
  );
}
