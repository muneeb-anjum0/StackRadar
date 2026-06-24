export function LoadingPanel({ label = "Reading signals" }: { label?: string }) {
  return (
    <div className="rounded-[1.35rem] border border-slate-200 bg-white/65 p-6">
      <div className="h-2 w-28 animate-pulse rounded-full bg-slate-200" />
      <p className="mt-4 text-sm text-slate-500">{label}...</p>
    </div>
  );
}
