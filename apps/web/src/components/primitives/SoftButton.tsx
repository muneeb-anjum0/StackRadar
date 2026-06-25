const variants = {
  primary: "border-[#3a404a] bg-[#1f252d] text-slate-100 hover:bg-[#262d36]",
  quiet: "border-[#252b34] bg-[#0d1014] text-slate-100 hover:border-[#343b46] hover:bg-[#12161c]",
  ghost: "border-transparent bg-transparent text-slate-400 hover:bg-[#101318] hover:text-slate-100",
  danger: "border-rose-400/20 bg-rose-500/10 text-rose-200 hover:border-rose-300/35",
  selected: "border-[#3a404a] bg-[#171c22] text-white",
  unselected: "border-[#252b34] bg-[#090b0e] text-slate-400 hover:bg-[#101318] hover:text-slate-100"
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
      className={`rounded-xl border px-4 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
