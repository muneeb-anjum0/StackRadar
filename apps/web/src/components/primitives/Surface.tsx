const levels = {
  1: "border-transparent bg-transparent shadow-none",
  2: "border-slate-200 bg-white/82 shadow-[0_18px_55px_rgba(15,23,42,0.06)]",
  3: "border-slate-200 bg-white/92 shadow-[0_28px_80px_rgba(15,23,42,0.09)]",
  4: "border-white bg-white/95 shadow-[0_35px_100px_rgba(15,23,42,0.14)]"
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
  return <section className={`rounded-[1.6rem] border backdrop-blur-xl ${levels[level]} ${className}`}>{children}</section>;
}
