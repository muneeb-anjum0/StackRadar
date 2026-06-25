import { useState } from "react";
import { LensHeader } from "../../components/shell/LensHeader";
import { SelectField } from "../../components/primitives/SelectField";
import { useAiReports, useAiStatus, useAiUsage } from "../../hooks/useAiReports";
import { AiProvider, AiReport } from "../../types/api";
import { ProviderPanel } from "./ProviderPanel";
import { ReportReader } from "./ReportReader";
import { ReportShelf } from "./ReportShelf";
import { UsagePanel } from "./UsagePanel";

const reportTypes = ["all", "career_report", "learning_roadmap", "role_fit", "project_suggestions", "skill_gap_brief", "job_quality"];

export function IntelligenceLens() {
  const [provider, setProvider] = useState<AiProvider | "all">("all");
  const [reportType, setReportType] = useState("all");
  const [selected, setSelected] = useState<AiReport | null>(null);
  const status = useAiStatus();
  const usage = useAiUsage();
  const reports = useAiReports({ provider: provider === "all" ? undefined : provider, reportType: reportType === "all" ? undefined : reportType });
  const visibleReports = reports.data ?? [];
  const active = selected ?? visibleReports[0] ?? null;

  return (
    <div className="space-y-7">
      <LensHeader
        eyebrow="AI Reports Lens"
        title="Every AI output has a provider trail"
        subtitle="Read generated reports, inspect cache/provider metadata and keep OpenRouter usage visible. Nothing on this page calls OpenRouter."
        action={<SelectField value={reportType} onChange={(event) => setReportType(event.target.value)} options={reportTypes} />}
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <ReportReader report={active} />
          <ReportShelf reports={visibleReports} onSelect={setSelected} />
        </div>
        <div className="space-y-5">
          <ProviderPanel provider={provider} onProvider={setProvider} status={status.data} />
          <UsagePanel usage={usage.data} />
        </div>
      </div>
    </div>
  );
}
