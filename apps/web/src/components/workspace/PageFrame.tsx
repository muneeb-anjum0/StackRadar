import { ReactNode } from "react";

export function PageFrame({ children, rail }: { children: ReactNode; rail?: ReactNode }) {
  if (!rail) {
    return <div className="space-y-6">{children}</div>;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
      <div className="min-w-0 space-y-6">{children}</div>
      <div className="xl:sticky xl:top-8 xl:h-fit">{rail}</div>
    </div>
  );
}
