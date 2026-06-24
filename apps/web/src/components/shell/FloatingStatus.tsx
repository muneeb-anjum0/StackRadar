export function FloatingStatus({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm shadow-[0_16px_45px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-slate-950">{value}</p>
    </div>
  );
}
