import { CountItem } from "../../types/api";

export function SkillRankList({ items }: { items: CountItem[] }) {
  return (
    <div className="divide-y divide-white/[0.07]">
      {items.slice(0, 12).map((item, index) => (
        <div key={item.name} className="flex items-center justify-between gap-3 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-100">{index + 1}. {item.name}</p>
            <p className="mt-1 text-xs text-slate-500">Appears in {item.percentage}% of clean jobs</p>
          </div>
          <span className="text-sm font-semibold text-slate-300">{item.count}</span>
        </div>
      ))}
    </div>
  );
}
