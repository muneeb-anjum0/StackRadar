export function LensHeader({ eyebrow, title, subtitle, action }: { eyebrow: string; title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <header className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{eyebrow}</p>
        <h1 className="mt-3 text-[clamp(2rem,4vw,4.2rem)] font-semibold leading-[0.95] tracking-normal text-slate-50">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">{subtitle}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
