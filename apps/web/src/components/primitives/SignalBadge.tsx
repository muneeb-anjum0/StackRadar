const tones = {
  neutral: "border-slate-200 bg-white/72 text-slate-600",
  strong: "border-slate-300 bg-slate-100 text-slate-950",
  good: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warn: "border-amber-200 bg-amber-50 text-amber-700"
};

export function SignalBadge({ tone = "neutral", children }: { tone?: keyof typeof tones; children: React.ReactNode }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}
