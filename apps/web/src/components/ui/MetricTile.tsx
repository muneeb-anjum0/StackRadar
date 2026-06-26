export function MetricTile({
  label,
  value,
  detail,
  tone = "cyan"
}: {
  label: string;
  value: React.ReactNode;
  detail?: React.ReactNode;
  tone?: "violet" | "cyan" | "green" | "neutral";
}) {
  const tones = {
    violet: "text-violet-200",
    cyan: "text-cyan-100",
    green: "text-emerald-100",
    neutral: "text-neutral-100"
  };
  return (
    <div className="group rounded-[1.2rem] border border-white/[0.08] bg-[#151515] p-4 hover:-translate-y-0.5 hover:border-white/[0.14]">
      <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">{label}</p>
      <p className={`mt-3 truncate text-2xl font-semibold tracking-normal ${tones[tone]}`}>{value}</p>
      {detail && <p className="mt-2 text-xs leading-5 text-neutral-500">{detail}</p>}
    </div>
  );
}
