export function ProgressLine({ value, className = "" }: { value: number; className?: string }) {
  const bounded = Math.max(0, Math.min(100, value));
  return (
    <div className={`h-2 overflow-hidden rounded-full bg-slate-100 ${className}`}>
      <div className="h-full rounded-full bg-slate-950 transition-all duration-500" style={{ width: `${bounded}%` }} />
    </div>
  );
}
