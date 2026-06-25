const variants = {
  primary: "border-white/12 bg-[#eef0f3] text-[#08090b] shadow-[0_14px_42px_rgba(238,240,243,0.12)] hover:bg-white",
  quiet: "border-white/[0.09] bg-white/[0.06] text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-white/16 hover:bg-white/[0.10]",
  ghost: "border-transparent bg-transparent text-slate-400 hover:bg-white/[0.06] hover:text-slate-100",
  danger: "border-rose-400/20 bg-rose-500/10 text-rose-200 hover:border-rose-300/35",
  selected: "border-white/16 bg-white/[0.13] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]",
  unselected: "border-white/[0.07] bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-slate-100"
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
      className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition duration-200 hover:-translate-y-0.5 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
