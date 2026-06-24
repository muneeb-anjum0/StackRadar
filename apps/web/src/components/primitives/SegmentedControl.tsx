export function SegmentedControl<T extends string>({
  value,
  options,
  onChange
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex rounded-xl border border-slate-200 bg-white/70 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${value === option.value ? "bg-slate-950 text-white" : "text-slate-500 hover:text-slate-950"}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
