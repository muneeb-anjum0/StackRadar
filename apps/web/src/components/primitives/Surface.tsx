const levels = {
  1: "border-transparent bg-transparent",
  2: "border-white/[0.08] bg-[#151515]",
  3: "border-white/[0.1] bg-[#181818]",
  4: "border-white/[0.14] bg-[#1c1c1c]"
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
  return <section className={`rounded-[1.35rem] border ${levels[level]} ${className}`}>{children}</section>;
}
