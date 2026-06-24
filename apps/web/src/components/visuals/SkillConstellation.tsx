import { CountItem } from "../../types/api";
import { SignalBadge } from "../primitives/SignalBadge";

export function SkillConstellation({ groups }: { groups: { category: string; items: CountItem[] }[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {groups.slice(0, 6).map((group) => (
        <div key={group.category} className="rounded-[1.25rem] border border-slate-100 bg-slate-50/60 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-900">{group.category}</h3>
            <span className="text-xs text-slate-400">{group.items.length} skills</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {group.items.slice(0, 10).map((skill, index) => (
              <SignalBadge key={skill.name} tone={index < 2 ? "strong" : "neutral"}>{skill.name}</SignalBadge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
