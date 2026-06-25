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
      className={`rounded-xl border border-[#252b34] bg-[#07090b] px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-[#3a404a] ${className}`}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  );
}
