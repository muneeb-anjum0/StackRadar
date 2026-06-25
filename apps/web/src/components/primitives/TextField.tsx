export function TextField({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`rounded-xl border border-white/[0.09] bg-[#0d0f12]/86 px-3.5 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-slate-400/50 focus:ring-4 focus:ring-slate-400/10 ${className}`}
      {...props}
    />
  );
}
