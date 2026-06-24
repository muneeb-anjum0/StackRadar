import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import { AiActionPanel } from "../components/intelligence/AiActionPanel";
import { IntelligenceBrief } from "../components/intelligence/IntelligenceBrief";
import { ReportHistoryShelf } from "../components/intelligence/ReportHistoryShelf";
import { CommandStrip } from "../components/workspace/CommandStrip";
import { InsightNote, InsightRail } from "../components/workspace/InsightRail";
import { ModuleCard } from "../components/workspace/ModuleCard";
import { PageFrame } from "../components/workspace/PageFrame";
import { SkillPill } from "../components/workspace/Pills";
import { SmoothSection } from "../components/workspace/SmoothSection";
import { WorkspaceHeader } from "../components/workspace/WorkspaceHeader";
import { useAiGenerate } from "../hooks/useAiGenerate";
import { useAiReports, useAiStatus, useAiUsage } from "../hooks/useAiReports";
import { useProviderChoice } from "../hooks/useProviderChoice";
import { parseSkills } from "../hooks/useSkillGapState";
import { api } from "../lib/api";
import { AiReport, CountItem, ReportType, SkillGap as SkillGapType } from "../types/api";

export function SkillGap() {
  const [role, setRole] = useState("Backend Developer");
  const [skills, setSkills] = useState("React, Node.js, MongoDB");
  const [selectedReport, setSelectedReport] = useState<AiReport | null>(null);
  const providerChoice = useProviderChoice("mock");
  const aiStatus = useAiStatus();
  const aiUsage = useAiUsage();
  const aiReports = useAiReports();
  const aiGenerate = useAiGenerate(aiUsage.data?.cooldown_seconds ?? 20);
  const roles = useQuery({ queryKey: ["top-roles"], queryFn: () => api.get<CountItem[]>("/analytics/top-roles") });
  const currentSkills = parseSkills(skills);
  const mutation = useMutation({
    mutationFn: () =>
      api.post<SkillGapType>("/analytics/skill-gap", {
        target_role: role,
        current_skills: currentSkills
      })
  });
  const aiError = aiGenerate.error instanceof Error ? aiGenerate.error.message : null;

  function generate(type: ReportType) {
    if (!mutation.data) return;
    aiGenerate.mutate(
      {
        reportType: type,
        payload: {
          target_role: role,
          current_skills: currentSkills,
          provider: providerChoice.provider,
          weeks: 4
        }
      },
      {
        onSuccess: (report) => setSelectedReport(report)
      }
    );
  }

  return (
    <PageFrame
      rail={
        <InsightRail title="Career fit notes">
          <InsightNote label="Target role" value={`Current analysis target is ${role}.`} />
          <InsightNote label="Input skills" value={`${currentSkills.length} skills are being compared against observed role demand.`} />
          <InsightNote label="Next step" value="Use the recommended next skills as a short learning sprint." />
        </InsightRail>
      }
    >
      <WorkspaceHeader
        label="Career fit analyzer"
        title="Compare your skills against market demand"
        subtitle="Turn the role-skill summary into a concise fit brief with matched skills, gaps and next moves."
        meta="Personal workspace"
      />
      <ModuleCard title="Target and current skills" eyebrow="Analysis input">
        <div className="grid gap-3 md:grid-cols-[240px_1fr_auto]">
          <Select value={role} onChange={(event) => setRole(event.target.value)} options={(roles.data ?? []).map((item) => item.name)} />
          <Input value={skills} onChange={(event) => setSkills(event.target.value)} placeholder="React, Node.js, MongoDB" />
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>Analyze fit</Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">{currentSkills.map((skill) => <SkillPill key={skill}>{skill}</SkillPill>)}</div>
      </ModuleCard>
      {mutation.data && (
        <>
          <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">Match score</p>
              <p className="mt-4 text-6xl font-semibold text-slate-950">{mutation.data.match_percentage}%</p>
              <p className="mt-4 text-sm leading-6 text-slate-500">{mutation.data.summary}</p>
            </section>
            <div className="grid gap-5 md:grid-cols-2">
              <SkillList title="Matched skills" skills={mutation.data.matched_skills} tone="good" />
              <SkillList title="Missing skills" skills={mutation.data.missing_skills} />
            </div>
          </div>
          <ModuleCard title="Next best skills" eyebrow="Learning sprint">
            <div className="flex flex-wrap gap-2">
              {mutation.data.recommended_next_skills.map((skill) => <Badge key={skill} tone="accent">{skill}</Badge>)}
            </div>
          </ModuleCard>
          <ModuleCard title="Generated intelligence brief" eyebrow="Summary">
            <p className="text-base leading-7 text-slate-600">{mutation.data.summary}</p>
          </ModuleCard>
          <SmoothSection>
            <AiActionPanel
              provider={providerChoice.provider}
              onProvider={providerChoice.setProvider}
              status={aiStatus.data}
              confirmed={providerChoice.geminiConfirmed}
              onConfirm={providerChoice.confirmGemini}
              cooldownRemaining={aiGenerate.cooldownRemaining}
              disabled={aiGenerate.isPending}
              activeType={aiGenerate.activeType}
              onGenerate={generate}
              sessionCount={aiGenerate.geminiSessionCount}
              usage={aiUsage.data}
            />
          </SmoothSection>
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            <IntelligenceBrief report={selectedReport} loading={aiGenerate.isPending} error={aiError} />
            <ReportHistoryShelf reports={(aiReports.data ?? []).slice(0, 5)} onSelect={setSelectedReport} />
          </div>
        </>
      )}
    </PageFrame>
  );
}

function SkillList({ title, skills, tone = "neutral" }: { title: string; skills: string[]; tone?: "neutral" | "accent" | "good" }) {
  return (
    <ModuleCard title={title}>
      <div className="flex flex-wrap gap-2">{skills.map((skill) => <Badge key={skill} tone={tone}>{skill}</Badge>)}</div>
    </ModuleCard>
  );
}
