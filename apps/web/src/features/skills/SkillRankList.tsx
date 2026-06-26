import { CountItem } from "../../types/api";
import { AnimatedList, AnimatedListItem } from "../../components/reactbits/AnimatedList/AnimatedList";

export function SkillRankList({ items }: { items: CountItem[] }) {
  return (
    <AnimatedList className="grid gap-2">
      {items.slice(0, 12).map((item, index) => (
        <AnimatedListItem key={item.name} className="grid grid-cols-[32px_minmax(0,1fr)_54px] items-center gap-3 rounded-2xl border border-white/[0.06] bg-[#111111] px-3 py-3">
          <span className="text-xs text-neutral-600">{String(index + 1).padStart(2, "0")}</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-neutral-100">{item.name}</p>
            <p className="mt-1 text-xs text-neutral-500">Appears in {item.percentage}% of clean jobs</p>
          </div>
          <span className="text-right text-sm font-semibold text-cyan-100">{item.count}</span>
        </AnimatedListItem>
      ))}
    </AnimatedList>
  );
}
