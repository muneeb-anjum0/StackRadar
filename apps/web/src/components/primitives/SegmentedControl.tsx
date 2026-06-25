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
    <div className="inline-flex rounded-xl border border-white/[0.08] bg-[#0d0f12]/72 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${value === option.value ? "bg-white/[0.12] text-white" : "text-slate-500 hover:text-slate-100"}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
