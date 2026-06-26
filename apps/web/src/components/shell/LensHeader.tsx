export function LensHeader({ eyebrow, title, subtitle, action }: { eyebrow: string; title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-500">{eyebrow}</p>
        <h1 className="mt-2 text-[clamp(1.75rem,3vw,3.25rem)] font-semibold leading-none tracking-normal text-neutral-50">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">{subtitle}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
