export function TextField({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`rounded-xl border border-[#252b34] bg-[#07090b] px-3.5 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-[#3a404a] ${className}`}
      {...props}
    />
  );
}
