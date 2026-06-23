import { useQuery } from "@tanstack/react-query";
import { LoadingState } from "../components/ui/LoadingState";
import { InsightCard } from "../components/cards/InsightCard";
import { RoleBarChart } from "../components/charts/RoleBarChart";
import { SkillBarChart } from "../components/charts/SkillBarChart";
import { WorkModePieChart } from "../components/charts/WorkModePieChart";
import { CommandStrip } from "../components/workspace/CommandStrip";
import { InsightNote, InsightRail } from "../components/workspace/InsightRail";
import { MarketSignalCard } from "../components/workspace/MarketSignalCard";
import { MetricStack, StackMetric } from "../components/workspace/MetricStack";
import { ModuleCard } from "../components/workspace/ModuleCard";
import { PageFrame } from "../components/workspace/PageFrame";
import { StatPill } from "../components/workspace/Pills";
import { WorkspaceHeader } from "../components/workspace/WorkspaceHeader";
import { api } from "../lib/api";
import { compactNumber } from "../lib/format";
import { CountItem, Overview as OverviewType } from "../types/api";

export function Overview() {
  const overview = useQuery({ queryKey: ["overview"], queryFn: () => api.get<OverviewType>("/analytics/overview") });
  const skills = useQuery({ queryKey: ["top-skills"], queryFn: () => api.get<CountItem[]>("/analytics/top-skills") });
  const roles = useQuery({ queryKey: ["top-roles"], queryFn: () => api.get<CountItem[]>("/analytics/top-roles") });
  const modes = useQuery({ queryKey: ["work-modes"], queryFn: () => api.get<CountItem[]>("/analytics/work-modes") });

  if (overview.isLoading) return <LoadingState />;
  const data = overview.data;
  if (!data) return null;
  const topSkill = data.most_demanded_skill ?? "Unknown";
  const topRole = data.most_common_role ?? "Unknown";

  return (
    <PageFrame
      rail={
        <InsightRail title="Market signals">
          <InsightNote label="Leading role" value={`${topRole} is the strongest role cluster in this local dataset.`} />
          <InsightNote label="Skill pressure" value={`${topSkill} appears as the top skill demand signal.`} />
          <InsightNote label="Remote market" value={`${data.remote_job_percentage}% of clean jobs mention remote work.`} />
          <InsightNote label="Data confidence" value={`Quality score is ${data.data_quality_score}%, strong enough for portfolio-grade analysis.`} />
        </InsightRail>
      }
    >
      <WorkspaceHeader
        label="Career intelligence workspace"
        title="Market command center"
        subtitle="A compact workspace for reading demand, skill pressure and quality signals from the local job market sample."
        meta="Live local API"
      />
      <CommandStrip>
        <StatPill label="Dataset" value={`${compactNumber(data.total_jobs)} clean jobs`} />
        <StatPill label="Companies" value={data.total_companies} />
        <StatPill label="Skills" value={data.total_skills} />
        <StatPill label="Freshness" value="Local seed" />
      </CommandStrip>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px]">
        <MarketSignalCard role={topRole} skill={topSkill} remote={data.remote_job_percentage} quality={data.data_quality_score} />
        <MetricStack>
          <StackMetric label="Top skill" value={topSkill} />
          <StackMetric label="Remote share" value={`${data.remote_job_percentage}%`} />
          <StackMetric label="Avg salary" value={compactNumber(data.average_salary)} />
        </MetricStack>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <ModuleCard title="Top Skills" eyebrow="Demand vectors"><div className="h-72">{skills.data && <SkillBarChart data={skills.data} />}</div></ModuleCard>
        <ModuleCard title="Role Demand" eyebrow="Market shape"><div className="h-72">{roles.data && <RoleBarChart data={roles.data} />}</div></ModuleCard>
      </div>
      <div className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
        <ModuleCard title="Work Mode Mix" eyebrow="Access pattern"><div className="h-72">{modes.data && <WorkModePieChart data={modes.data} />}</div></ModuleCard>
        <ModuleCard title="Intelligence Notes" eyebrow="Readout">
          <div className="grid gap-3 md:grid-cols-2">
            <InsightCard title="Demand signal" body={`${topSkill} is the strongest recurring skill in the local dataset.`} />
            <InsightCard title="Hiring shape" body={`${topRole} currently leads role demand across the seeded postings.`} />
            <InsightCard title="Remote access" body={`${data.remote_job_percentage}% of cleaned jobs mention remote work.`} />
            <InsightCard title="Compensation coverage" body={`Average parsed salary is ${compactNumber(data.average_salary)} where salary text is usable.`} />
          </div>
        </ModuleCard>
      </div>
    </PageFrame>
  );
}
