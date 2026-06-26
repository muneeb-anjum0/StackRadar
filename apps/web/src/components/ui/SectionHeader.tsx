export function SectionHeader({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-500">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-normal text-neutral-50">{title}</h2>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
