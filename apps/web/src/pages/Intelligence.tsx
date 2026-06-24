import { useState } from "react";
import { IntelligenceBrief } from "../components/intelligence/IntelligenceBrief";
import { ReportHistoryShelf } from "../components/intelligence/ReportHistoryShelf";
import { ProviderSwitch } from "../components/intelligence/ProviderSwitch";
import { Select } from "../components/ui/Select";
import { CommandLine } from "../components/workspace/CommandLine";
import { ContextItem, ContextStack } from "../components/workspace/ContextStack";
import { EditorialPanel } from "../components/workspace/EditorialPanel";
import { SignalCell, SignalStrip } from "../components/workspace/SignalStrip";
import { WorkspaceCanvas } from "../components/workspace/WorkspaceCanvas";
import { useAiReports, useAiStatus, useAiUsage } from "../hooks/useAiReports";
import { AiProvider, AiReport } from "../types/api";

const reportOptions = ["all", "career_report", "learning_roadmap", "role_fit", "project_suggestions", "skill_gap_brief", "job_quality"];
const providerOptions = ["all", "mock", "gemini"];

export function Intelligence() {
  const [reportType, setReportType] = useState("all");
  const [provider, setProvider] = useState("all");
  const [selected, setSelected] = useState<AiReport | null>(null);
  const status = useAiStatus();
  const usage = useAiUsage();
  const reports = useAiReports({
    reportType: reportType === "all" ? undefined : reportType,
    provider: provider === "all" ? undefined : provider
  });
  const visibleReports = reports.data ?? [];
  const activeReport = selected ?? visibleReports[0] ?? null;

  return (
    <WorkspaceCanvas>
      <CommandLine>
        <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">AI reports</span>
        <Select value={reportType} onChange={(event) => setReportType(event.target.value)} options={reportOptions} className="w-full sm:w-56" />
        <Select value={provider} onChange={(event) => setProvider(event.target.value)} options={providerOptions} className="w-full sm:w-40" />
      </CommandLine>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-6">
          <EditorialPanel eyebrow="Career intelligence operating system" title="Manual AI briefs grounded in your StackRadar data">
            Mock mode is the default and works without a key. Gemini is available only as a manual backend action, with cooldown and report reuse.
          </EditorialPanel>
          <SignalStrip>
            <SignalCell label="Default provider" value={status.data?.default_provider ?? "mock"} />
            <SignalCell label="Gemini configured" value={status.data?.gemini_configured ? "yes" : "no"} />
            <SignalCell label="Mock reports" value={usage.data?.mock_reports_total ?? 0} />
            <SignalCell label="Gemini reports" value={usage.data?.gemini_reports_total ?? 0} />
          </SignalStrip>
          <IntelligenceBrief report={activeReport} loading={reports.isLoading} />
          <ReportHistoryShelf reports={visibleReports} onSelect={setSelected} />
        </div>
        <ContextStack>
          <ContextItem label="Provider mode" value={<ProviderSwitch provider={(provider === "gemini" ? "gemini" : "mock") as AiProvider} onChange={(value) => setProvider(value)} status={status.data} />} />
          <ContextItem label="Quota note" value={status.data?.gemini_usage_note ?? "Gemini is manual only and uses API quota."} />
          <ContextItem label="Latest Gemini" value={usage.data?.latest_gemini_report_at ? new Date(usage.data.latest_gemini_report_at).toLocaleString() : "No Gemini report stored"} />
          <ContextItem label="Selected report" value={activeReport ? `${activeReport.report_type.replace(/_/g, " ")} for ${activeReport.target_role}` : "No report selected"} />
        </ContextStack>
      </div>
    </WorkspaceCanvas>
  );
}
