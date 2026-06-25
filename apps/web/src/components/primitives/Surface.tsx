const levels = {
  1: "border-transparent bg-transparent shadow-none",
  2: "border-white/[0.07] bg-[#121418]/88 shadow-[0_22px_70px_rgba(0,0,0,0.20)]",
  3: "border-white/[0.09] bg-[#151820]/92 shadow-[0_28px_90px_rgba(0,0,0,0.28)]",
  4: "border-white/[0.10] bg-[#1b1f27]/94 shadow-[0_34px_110px_rgba(0,0,0,0.34)]"
};

export function Surface({
  level = 2,
  className = "",
  children
}: {
  level?: 1 | 2 | 3 | 4;
  className?: string;
  children: React.ReactNode;
}) {
  return <section className={`rounded-[1.45rem] border backdrop-blur-xl ${levels[level]} ${className}`}>{children}</section>;
}
