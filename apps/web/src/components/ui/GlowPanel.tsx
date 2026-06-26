import { BorderGlow } from "../reactbits/BorderGlow/BorderGlow";

export function GlowPanel({
  children,
  className = "",
  tone = "violet"
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "violet" | "cyan" | "green";
}) {
  return (
    <BorderGlow tone={tone} className={className}>
      {children}
    </BorderGlow>
  );
}
