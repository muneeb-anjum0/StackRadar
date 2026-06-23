import { ReactNode } from "react";

export function WorkspaceHeader({
  label,
  title,
  subtitle,
  meta,
  action
}: {
  label: string;
  title: string;
  subtitle: string;
  meta?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{label}</p>
        <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-normal text-slate-950">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">
        {meta && (
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm">
            {meta}
          </span>
        )}
        {action}
      </div>
    </div>
  );
}
