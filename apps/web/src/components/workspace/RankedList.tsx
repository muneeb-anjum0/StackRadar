export type RankedItem = {
  name: string;
  count: number;
  percentage: number;
};

export function RankedList({ items }: { items: RankedItem[] }) {
  const max = Math.max(...items.map((item) => item.count), 1);
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={item.name} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-semibold text-slate-500 shadow-sm">
                {index + 1}
              </span>
              <span className="text-sm font-medium text-slate-900">{item.name}</span>
            </div>
            <span className="text-xs font-medium text-slate-500">{item.count} jobs</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-slate-700" style={{ width: `${(item.count / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
