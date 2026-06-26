export function TextField({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`rounded-xl border border-white/[0.08] bg-[#151515] px-3.5 py-2.5 text-sm text-neutral-100 outline-none placeholder:text-neutral-600 focus:border-cyan-200/30 ${className}`}
      {...props}
    />
  );
}
