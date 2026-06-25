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
    <div className="inline-flex rounded-xl border border-[#252b34] bg-[#07090b] p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${value === option.value ? "bg-[#171c22] text-white" : "text-slate-500 hover:text-slate-100"}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
