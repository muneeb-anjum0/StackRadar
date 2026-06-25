export function ProgressLine({ value, className = "" }: { value: number; className?: string }) {
  const bounded = Math.max(0, Math.min(100, value));
  return (
    <div className={`h-2 overflow-hidden rounded-full bg-white/[0.07] ${className}`}>
      <div className="h-full rounded-full bg-slate-300 transition-all duration-500" style={{ width: `${bounded}%` }} />
    </div>
  );
}
