export function LoadingState() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <div key={item} className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm" />
      ))}
    </div>
  );
}
