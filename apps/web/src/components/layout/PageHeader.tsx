export function PageHeader({
  title,
  subtitle,
  chip
}: {
  title: string;
  subtitle: string;
  chip?: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">StackRadar</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{subtitle}</p>
      </div>
      {chip && (
        <span className="w-fit rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
          {chip}
        </span>
      )}
    </div>
  );
}
