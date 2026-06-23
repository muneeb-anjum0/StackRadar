import { useQuery } from "@tanstack/react-query";
import { ChartCard } from "../components/ui/ChartCard";
import { LoadingState } from "../components/ui/LoadingState";
import { MetricCard } from "../components/cards/MetricCard";
import { InsightCard } from "../components/cards/InsightCard";
import { PageHeader } from "../components/layout/PageHeader";
import { RoleBarChart } from "../components/charts/RoleBarChart";
import { SkillBarChart } from "../components/charts/SkillBarChart";
import { WorkModePieChart } from "../components/charts/WorkModePieChart";
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Market Overview"
        subtitle="A clean read on role demand, skill pressure, remote availability and data quality across the local job dataset."
        chip="Live local API"
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Total jobs" value={compactNumber(data.total_jobs)} />
        <MetricCard label="Top skill" value={data.most_demanded_skill ?? "N/A"} />
        <MetricCard label="Top role" value={data.most_common_role ?? "N/A"} />
        <MetricCard label="Remote share" value={`${data.remote_job_percentage}%`} />
        <MetricCard label="Quality score" value={`${data.data_quality_score}%`} />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Top Skills">{skills.data && <SkillBarChart data={skills.data} />}</ChartCard>
        <ChartCard title="Top Roles">{roles.data && <RoleBarChart data={roles.data} />}</ChartCard>
      </div>
      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <ChartCard title="Work Modes">{modes.data && <WorkModePieChart data={modes.data} />}</ChartCard>
        <section className="glass rounded-2xl p-5">
          <h3 className="mb-4 text-sm font-semibold text-slate-800">Recent Insights</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <InsightCard title="Demand signal" body={`${data.most_demanded_skill ?? "Core engineering"} is the strongest recurring skill in the local dataset.`} />
            <InsightCard title="Hiring shape" body={`${data.most_common_role ?? "Software roles"} currently leads role demand across the seeded postings.`} />
            <InsightCard title="Remote access" body={`${data.remote_job_percentage}% of cleaned jobs mention remote work, useful for career switchers outside major hubs.`} />
            <InsightCard title="Compensation coverage" body={`Average parsed salary is ${compactNumber(data.average_salary)} where salary text is usable.`} />
          </div>
        </section>
      </div>
    </div>
  );
}
