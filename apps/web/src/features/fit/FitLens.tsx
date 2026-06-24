import { useState } from "react";
import { LensHeader } from "../../components/shell/LensHeader";
import { Surface } from "../../components/primitives/Surface";
import { FitMeter } from "../../components/visuals/FitMeter";
import { useAiGenerate } from "../../hooks/useAiGenerate";
import { useAiReports, useAiStatus, useAiUsage } from "../../hooks/useAiReports";
import { useFitAnalysis } from "../../hooks/useFitAnalysis";
import { useProviderChoice } from "../../hooks/useProviderChoice";
import { parseSkills } from "../../hooks/useSkillGapState";
import { AiReport, ReportType } from "../../types/api";
import { AiBriefStudio } from "./AiBriefStudio";
import { FitExplainer } from "./FitExplainer";
import { FitInputPanel } from "./FitInputPanel";
import { SkillGapPath } from "./SkillGapPath";

export function FitLens() {
  const [role, setRole] = useState("Backend Developer");
  const [skills, setSkills] = useState("React, Node.js, MongoDB");
  const [selectedReport, setSelectedReport] = useState<AiReport | null>(null);
  const currentSkills = parseSkills(skills);
  const fit = useFitAnalysis(role, currentSkills);
  const provider = useProviderChoice("mock");
  const aiStatus = useAiStatus();
  const aiUsage = useAiUsage();
  const aiReports = useAiReports();
  const aiGenerate = useAiGenerate(aiUsage.data?.cooldown_seconds ?? 20);
  const aiError = aiGenerate.error instanceof Error ? aiGenerate.error.message : null;

  function generate(type: ReportType) {
    if (!fit.analysis.data) return;
    aiGenerate.mutate(
      { reportType: type, payload: { target_role: role, current_skills: currentSkills, provider: provider.provider, weeks: 4 } },
      { onSuccess: setSelectedReport }
    );
  }

  return (
    <div className="space-y-7">
      <LensHeader
        eyebrow="Fit Lens"
        title="How close am I, and what is my next move?"
        subtitle="Deterministic fit stays fast and non-AI. AI briefs are a separate manual studio with Mock default and Gemini quota warnings."
      />
      <FitInputPanel
        role={role}
        skills={skills}
        roles={(fit.roles.data ?? []).map((item) => item.name)}
        loading={fit.analysis.isPending}
        onRole={setRole}
        onSkills={setSkills}
        onAnalyze={() => fit.analysis.mutate()}
      />
      <FitExplainer />
      {fit.analysis.data && (
        <>
          <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
            <FitMeter value={fit.analysis.data.match_percentage} summary={fit.analysis.data.summary} />
            <Surface level={2} className="p-5">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-950">Skill gap path</h2>
                <span className="text-xs text-slate-400">AI used: No</span>
              </div>
              <SkillGapPath matched={fit.analysis.data.matched_skills} missing={fit.analysis.data.missing_skills} next={fit.analysis.data.recommended_next_skills} />
            </Surface>
          </div>
          <AiBriefStudio
            provider={provider.provider}
            onProvider={provider.setProvider}
            confirmed={provider.geminiConfirmed}
            onConfirm={provider.confirmGemini}
            status={aiStatus.data}
            usage={aiUsage.data}
            reports={aiReports.data ?? []}
            selected={selectedReport}
            loading={aiGenerate.isPending}
            activeType={aiGenerate.activeType}
            cooldownRemaining={aiGenerate.cooldownRemaining}
            error={aiError}
            onGenerate={generate}
            onSelect={setSelectedReport}
          />
        </>
      )}
    </div>
  );
}
