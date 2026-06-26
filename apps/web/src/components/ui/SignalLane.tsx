import { CountItem } from "../../types/api";

export function SignalLane({
  title,
  caption,
  items,
  tone = "cyan"
}: {
  title: string;
  caption: string;
  items: CountItem[];
  tone?: "violet" | "cyan" | "green";
}) {
  const max = Math.max(...items.map((item) => item.count), 1);
  const colors = {
    violet: "bg-violet-300",
    cyan: "bg-cyan-200",
    green: "bg-emerald-300"
  };

  return (
    <section className="rounded-[1.25rem] border border-white/[0.08] bg-[#151515] p-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">{title}</p>
      <h3 className="mt-2 text-lg font-semibold text-neutral-100">{caption}</h3>
      <div className="mt-5 grid gap-3">
        {items.slice(0, 6).map((item, index) => (
          <div key={item.name} className="grid grid-cols-[28px_minmax(0,1fr)_44px] items-center gap-3">
            <span className="text-xs text-neutral-600">0{index + 1}</span>
            <div className="min-w-0">
              <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-medium text-neutral-200">{item.name}</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#111111]">
                <div className={`h-full rounded-full ${colors[tone]}`} style={{ width: `${Math.max(8, (item.count / max) * 100)}%` }} />
              </div>
            </div>
            <span className="text-right text-xs font-medium text-neutral-500">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}
