import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import { PageHeader } from "../components/layout/PageHeader";
import { api } from "../lib/api";
import { CountItem, SkillGap as SkillGapType } from "../types/api";

export function SkillGap() {
  const [role, setRole] = useState("Backend Developer");
  const [skills, setSkills] = useState("React, Node.js, MongoDB");
  const roles = useQuery({ queryKey: ["top-roles"], queryFn: () => api.get<CountItem[]>("/analytics/top-roles") });
  const mutation = useMutation({
    mutationFn: () =>
      api.post<SkillGapType>("/analytics/skill-gap", {
        target_role: role,
        current_skills: skills.split(",").map((item) => item.trim())
      })
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skill Gap Checker"
        subtitle="Compare your current skills against the strongest observed requirements for a target role."
      />
      <section className="glass rounded-2xl p-5">
        <div className="grid gap-3 md:grid-cols-[220px_1fr_auto]">
          <Select value={role} onChange={(event) => setRole(event.target.value)} options={(roles.data ?? []).map((item) => item.name)} />
          <Input value={skills} onChange={(event) => setSkills(event.target.value)} placeholder="React, Node.js, MongoDB" />
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>Analyze</Button>
        </div>
      </section>
      {mutation.data && (
        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <section className="glass rounded-2xl p-6">
            <p className="text-sm text-slate-500">Match percentage</p>
            <p className="mt-3 text-5xl font-semibold text-slate-950">{mutation.data.match_percentage}%</p>
            <p className="mt-4 text-sm leading-6 text-slate-500">{mutation.data.summary}</p>
          </section>
          <section className="glass grid gap-5 rounded-2xl p-6 md:grid-cols-3">
            <SkillList title="Matched" skills={mutation.data.matched_skills} tone="good" />
            <SkillList title="Missing" skills={mutation.data.missing_skills} />
            <SkillList title="Recommended Next" skills={mutation.data.recommended_next_skills} tone="accent" />
          </section>
        </div>
      )}
    </div>
  );
}

function SkillList({ title, skills, tone = "neutral" }: { title: string; skills: string[]; tone?: "neutral" | "accent" | "good" }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-slate-800">{title}</h3>
      <div className="flex flex-wrap gap-2">{skills.map((skill) => <Badge key={skill} tone={tone}>{skill}</Badge>)}</div>
    </div>
  );
}
