export function TimelineShelf({ items }: { items: { id: string | number; title: string; meta: string; status?: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="grid grid-cols-[10px_1fr] gap-3">
          <span className="mt-2 h-2.5 w-2.5 rounded-full bg-slate-300" />
          <div className="border-b border-white/[0.07] pb-3">
            <p className="text-sm font-medium text-slate-100">{item.title}</p>
            <p className="mt-1 text-xs text-slate-500">{item.meta}{item.status ? ` / ${item.status}` : ""}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
