export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "accent" | "good" }) {
  const styles = {
    neutral: "border-slate-200 bg-slate-50 text-slate-600",
    accent: "border-slate-300 bg-slate-100 text-slate-900",
    good: "border-emerald-200 bg-emerald-50 text-emerald-700"
  };
  return <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${styles[tone]}`}>{children}</span>;
}
