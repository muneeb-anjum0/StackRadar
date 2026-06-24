import { AiReport } from "../../types/api";
import { ReportCard } from "../../components/visuals/ReportCard";
import { EmptyPanel } from "../../components/primitives/EmptyPanel";

export function ReportShelf({ reports, onSelect }: { reports: AiReport[]; onSelect: (report: AiReport) => void }) {
  if (!reports.length) return <EmptyPanel title="No reports yet." body="Generate a manual brief from Fit Lens to populate this shelf." />;
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {reports.map((report) => <ReportCard key={report.id} report={report} onClick={onSelect} />)}
    </div>
  );
}
