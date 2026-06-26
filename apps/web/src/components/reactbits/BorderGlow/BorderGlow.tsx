export function BorderGlow({
  children,
  className = "",
  tone = "violet"
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "violet" | "cyan" | "green";
}) {
  const tones = {
    violet: "from-violet-400/45 via-cyan-300/20 to-transparent",
    cyan: "from-cyan-300/45 via-violet-400/20 to-transparent",
    green: "from-emerald-300/45 via-cyan-300/20 to-transparent"
  };

  return (
    <div className={`group relative rounded-[1.55rem] p-px ${className}`}>
      <div className={`absolute inset-0 rounded-[1.55rem] bg-gradient-to-br ${tones[tone]} opacity-70 blur-[1px]`} />
      <div className="relative rounded-[1.5rem] border border-white/[0.08] bg-[#151515]">{children}</div>
    </div>
  );
}
