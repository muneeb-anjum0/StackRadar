const levels = {
  1: "border-transparent bg-transparent shadow-none",
  2: "border-slate-200 bg-white/82 shadow-none",
  3: "border-slate-200 bg-white/92 shadow-none",
  4: "border-slate-200 bg-white/95 shadow-none"
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
  return <section className={`rounded-[1.6rem] border ${levels[level]} ${className}`}>{children}</section>;
}
