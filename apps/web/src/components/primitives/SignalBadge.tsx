const tones = {
  neutral: "border-white/[0.09] bg-white/[0.06] text-slate-300",
  strong: "border-slate-300/22 bg-slate-200/12 text-slate-100",
  good: "border-emerald-300/20 bg-emerald-400/10 text-emerald-200",
  warn: "border-amber-300/24 bg-amber-400/10 text-amber-200",
  danger: "border-rose-300/24 bg-rose-400/10 text-rose-200"
};

export function SignalBadge({ tone = "neutral", children }: { tone?: keyof typeof tones; children: React.ReactNode }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}
