import { useState } from "react";
import { LensHeader } from "../../components/shell/LensHeader";
import { Surface } from "../../components/primitives/Surface";
import { TextField } from "../../components/primitives/TextField";
import { LoadingPanel } from "../../components/primitives/LoadingPanel";
import { SkillConstellation } from "../../components/visuals/SkillConstellation";
import { useSkillData } from "../../hooks/useSkillData";
import { FeaturedSkill } from "./FeaturedSkill";
import { SkillRankList } from "./SkillRankList";

export function SkillLens() {
  const [query, setQuery] = useState("");
  const { skills, filtered, categories, featured } = useSkillData(query);
  if (skills.isLoading) return <LoadingPanel label="Mapping skill demand" />;

  return (
    <div className="space-y-7">
      <LensHeader
        eyebrow="Skill Lens"
        title="Skills"
        subtitle="Decide which skills are worth learning or proving in your portfolio."
        action={<TextField value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search skills" />}
      />
      <FeaturedSkill skill={featured} />
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Surface level={2} className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-100">Skill demand ranking</h2>
            <span className="text-xs text-slate-500">{filtered.length} skills</span>
          </div>
          <SkillRankList items={filtered} />
        </Surface>
        <Surface level={2} className="p-5">
          <div className="mb-5">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Decision strip</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-100">Portfolio signals to act on</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <DecisionFact label="Best frontend signal" value={findCategory(categories, "frontend") ?? featured?.name ?? "N/A"} />
            <DecisionFact label="Best backend signal" value={findCategory(categories, "backend") ?? "N/A"} />
            <DecisionFact label="Best data signal" value={findCategory(categories, "data") ?? "N/A"} />
            <DecisionFact label="Best portfolio booster" value={filtered[1]?.name ?? featured?.name ?? "N/A"} />
          </div>
        </Surface>
      </div>
      <Surface level={3} className="p-6">
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Skill groups</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-100">Demand by category</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Skill groups show whether demand is frontend-heavy, backend-heavy, data-heavy, cloud-heavy or tool-heavy.</p>
        </div>
        <SkillConstellation groups={categories} />
      </Surface>
    </div>
  );
}

function findCategory(categories: { category: string; items: { name: string }[] }[], key: string) {
  return categories.find((group) => group.category.toLowerCase().includes(key))?.items[0]?.name;
}

function DecisionFact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0d0f12]/72 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 font-semibold text-slate-100">{value}</p>
    </div>
  );
}
