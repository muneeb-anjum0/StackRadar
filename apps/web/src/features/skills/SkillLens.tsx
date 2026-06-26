import { useState } from "react";
import { LensHeader } from "../../components/shell/LensHeader";
import { Surface } from "../../components/primitives/Surface";
import { TextField } from "../../components/primitives/TextField";
import { LoadingPanel } from "../../components/primitives/LoadingPanel";
import { SkillConstellation } from "../../components/visuals/SkillConstellation";
import { useSkillData } from "../../hooks/useSkillData";
import { FeaturedSkill } from "./FeaturedSkill";
import { SkillRankList } from "./SkillRankList";
import { SectionHeader } from "../../components/ui/SectionHeader";

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
          <SectionHeader eyebrow="Animated demand stack" title="Skill demand ranking" action={<span className="text-xs text-neutral-500">{filtered.length} skills</span>} />
          <SkillRankList items={filtered} />
        </Surface>
        <Surface level={2} className="p-5">
          <SectionHeader eyebrow="Decision strip" title="Portfolio signals to act on" />
          <div className="grid gap-3 sm:grid-cols-2">
            <DecisionFact label="Best frontend signal" value={findCategory(categories, "frontend") ?? featured?.name ?? "N/A"} />
            <DecisionFact label="Best backend signal" value={findCategory(categories, "backend") ?? "N/A"} />
            <DecisionFact label="Best data signal" value={findCategory(categories, "data") ?? "N/A"} />
            <DecisionFact label="Best portfolio booster" value={filtered[1]?.name ?? featured?.name ?? "N/A"} />
          </div>
        </Surface>
      </div>
      <Surface level={3} className="p-6">
        <SectionHeader
          eyebrow="Skill groups"
          title="Demand by category"
          description="Skill groups show whether demand is frontend-heavy, backend-heavy, data-heavy, cloud-heavy or tool-heavy."
        />
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
    <div className="rounded-2xl border border-white/[0.08] bg-[#111111] p-4 hover:-translate-y-0.5 hover:border-white/[0.14]">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-2 font-semibold text-neutral-100">{value}</p>
    </div>
  );
}
