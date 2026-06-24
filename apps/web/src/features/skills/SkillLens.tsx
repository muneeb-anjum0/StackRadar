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
        title="Skill pressure without the spreadsheet"
        subtitle="Search the extracted skill graph, then read clusters and demand weight as a constellation instead of another dashboard chart."
        action={<TextField value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search skills" />}
      />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <FeaturedSkill skill={featured} />
        <Surface level={2} className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-950">Ranked pressure</h2>
            <span className="text-xs text-slate-400">{filtered.length} skills</span>
          </div>
          <SkillRankList items={filtered} />
        </Surface>
      </div>
      <Surface level={3} className="p-6">
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Skill constellation</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Grouped by extracted category</h2>
        </div>
        <SkillConstellation groups={categories} />
      </Surface>
    </div>
  );
}
