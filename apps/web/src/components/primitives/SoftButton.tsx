const variants = {
  primary: "border-slate-950 bg-slate-950 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_14px_32px_rgba(15,23,42,0.16)] hover:bg-slate-800",
  quiet: "border-slate-200 bg-white text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_10px_26px_rgba(15,23,42,0.05)] hover:border-slate-300",
  ghost: "border-transparent bg-transparent text-slate-500 hover:bg-white/70 hover:text-slate-950",
  danger: "border-rose-100 bg-rose-50 text-rose-700 hover:border-rose-200",
  selected: "border-slate-300 bg-slate-100 text-slate-950 shadow-inner",
  unselected: "border-slate-200 bg-white/70 text-slate-500 hover:bg-white hover:text-slate-900"
};

export function SoftButton({
  variant = "quiet",
  className = "",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
}) {
  return (
    <button
      className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition duration-200 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
