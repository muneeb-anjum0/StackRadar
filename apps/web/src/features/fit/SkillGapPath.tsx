import { SignalBadge } from "../../components/primitives/SignalBadge";

export function SkillGapPath({ matched, missing, next }: { matched: string[]; missing: string[]; next: string[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <PathColumn title="Already working" label="matched" items={matched} tone="good" />
      <PathColumn title="Gap to close" label="missing" items={missing} tone="neutral" />
      <PathColumn title="Next move" label="recommended" items={next} tone="strong" />
    </div>
  );
}

function PathColumn({ title, label, items, tone }: { title: string; label: string; items: string[]; tone: "good" | "neutral" | "strong" }) {
  return (
    <div className="rounded-[1.25rem] border border-[#20242b] bg-[#07090b] p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <h3 className="mt-2 font-semibold text-slate-100">{title}</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.length ? items.map((item) => <SignalBadge key={item} tone={tone}>{item}</SignalBadge>) : <span className="text-sm text-slate-500">No signal yet</span>}
      </div>
    </div>
  );
}
