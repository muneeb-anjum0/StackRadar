export function SkillPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
      {children}
    </span>
  );
}

export function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
      {label}: <span className="text-slate-950">{value}</span>
    </span>
  );
}
