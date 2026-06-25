export function LoadingPanel({ label = "Reading signals" }: { label?: string }) {
  return (
    <div className="rounded-[1.35rem] border border-white/[0.08] bg-[#121418]/72 p-6">
      <div className="h-2 w-28 animate-pulse rounded-full bg-slate-500/30" />
      <p className="mt-4 text-sm text-slate-400">{label}...</p>
    </div>
  );
}
