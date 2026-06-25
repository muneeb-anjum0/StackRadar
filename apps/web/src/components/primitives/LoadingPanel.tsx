export function LoadingPanel({ label = "Reading signals" }: { label?: string }) {
  return (
    <div className="rounded-[1.35rem] border border-[#20242b] bg-[#0b0d10] p-6">
      <div className="h-2 w-28 rounded-full bg-[#252b34]" />
      <p className="mt-4 text-sm text-slate-400">{label}...</p>
    </div>
  );
}
