import { CountItem } from "../../types/api";

export function SkillRankList({ items }: { items: CountItem[] }) {
  return (
    <div className="divide-y divide-slate-100">
      {items.slice(0, 12).map((item, index) => (
        <div key={item.name} className="flex items-center justify-between gap-3 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">{index + 1}. {item.name}</p>
            <p className="mt-1 text-xs text-slate-400">{item.percentage}% demand share</p>
          </div>
          <span className="text-sm font-semibold text-slate-500">{item.count}</span>
        </div>
      ))}
    </div>
  );
}
