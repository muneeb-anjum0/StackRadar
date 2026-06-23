export function MarketSignalCard({
  role,
  skill,
  remote,
  quality
}: {
  role: string;
  skill: string;
  remote: number;
  quality: number;
}) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">Market snapshot</p>
      <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-normal text-slate-950">
        {role} leads this dataset, with {skill} as the strongest skill signal.
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500">
        The local sample is clean enough for portfolio-grade analysis, with {remote}% remote availability and a {quality}% quality score.
      </p>
    </section>
  );
}
