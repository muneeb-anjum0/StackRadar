const levels = {
  1: "border-transparent bg-transparent",
  2: "border-[#20242b] bg-[#0b0d10]",
  3: "border-[#242933] bg-[#0d1014]",
  4: "border-[#2a303a] bg-[#11151a]"
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
  return <section className={`rounded-[1.25rem] border ${levels[level]} ${className}`}>{children}</section>;
}
