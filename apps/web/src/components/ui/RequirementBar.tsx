export function RequirementBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="truncate text-neutral-300">{label}</span>
        <span className="text-neutral-500">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-[#111111]">
        <div className="h-full rounded-full bg-emerald-300" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
