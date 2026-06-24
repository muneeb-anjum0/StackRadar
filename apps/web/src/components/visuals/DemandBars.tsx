import { CountItem } from "../../types/api";

export function DemandBars({ items, limit = 8 }: { items: CountItem[]; limit?: number }) {
  const max = Math.max(...items.map((item) => item.count), 1);
  return (
    <div className="space-y-3">
      {items.slice(0, limit).map((item) => (
        <div key={item.name} className="grid grid-cols-[minmax(0,1fr)_44px] items-center gap-3">
          <div>
            <div className="mb-1 flex justify-between gap-3 text-sm">
              <span className="truncate font-medium text-slate-800">{item.name}</span>
              <span className="text-slate-400">{item.percentage}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-slate-900" style={{ width: `${(item.count / max) * 100}%` }} />
            </div>
          </div>
          <span className="text-right text-sm text-slate-500">{item.count}</span>
        </div>
      ))}
    </div>
  );
}
