export function SelectField({
  options,
  placeholder,
  className = "",
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: string[];
  placeholder?: string;
}) {
  return (
    <select
      className={`rounded-xl border border-white/[0.09] bg-[#0d0f12]/86 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition focus:border-slate-400/50 focus:ring-4 focus:ring-slate-400/10 ${className}`}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  );
}
