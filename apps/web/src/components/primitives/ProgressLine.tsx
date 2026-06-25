export function ProgressLine({ value, className = "" }: { value: number; className?: string }) {
  const bounded = Math.max(0, Math.min(100, value));
  return (
    <div className={`h-2 overflow-hidden rounded-full bg-[#07090b] ${className}`}>
      <div className="h-full rounded-full bg-[#5f6875]" style={{ width: `${bounded}%` }} />
    </div>
  );
}
