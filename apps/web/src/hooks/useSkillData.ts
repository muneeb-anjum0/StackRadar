import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { CountItem, JobResponse } from "../types/api";

export function useSkillData(query: string) {
  const skills = useQuery({ queryKey: ["top-skills"], queryFn: () => api.get<CountItem[]>("/analytics/top-skills") });
  const jobs = useQuery({ queryKey: ["jobs-skill-categories"], queryFn: () => api.get<JobResponse>("/jobs?limit=200") });
  const filtered = (skills.data ?? []).filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
  const categories = useMemo(() => {
    const map = new Map<string, CountItem[]>();
    jobs.data?.jobs.flatMap((job) => job.skills).forEach((skill) => {
      const existing = map.get(skill.category) ?? [];
      if (!existing.find((item) => item.name === skill.name)) existing.push({ name: skill.name, count: 1, percentage: 0 });
      else existing.find((item) => item.name === skill.name)!.count += 1;
      map.set(skill.category, existing);
    });
    return Array.from(map.entries()).map(([category, items]) => ({ category, items: items.sort((a, b) => b.count - a.count) }));
  }, [jobs.data]);
  return { skills, jobs, filtered, categories, featured: filtered[0] ?? skills.data?.[0] };
}
