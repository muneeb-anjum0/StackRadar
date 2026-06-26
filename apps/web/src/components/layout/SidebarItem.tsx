import { Page } from "../shell/types";

export function SidebarItem({
  id,
  label,
  description,
  icon: Icon,
  active,
  collapsed,
  onSelect
}: {
  id: Page;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  collapsed: boolean;
  onSelect: (page: Page) => void;
}) {
  return (
    <button
      type="button"
      title={collapsed ? `${label}: ${description}` : undefined}
      aria-label={collapsed ? label : undefined}
      onClick={() => onSelect(id)}
      className={`cursor-target group relative grid min-h-[52px] w-full items-center rounded-[1rem] border text-left ${
        collapsed ? "place-items-center px-0" : "grid-cols-[36px_minmax(0,1fr)] gap-3 px-3"
      } ${
        active
          ? "border-cyan-200/20 bg-[#1c1c1c] text-neutral-50"
          : "border-transparent text-neutral-500 hover:border-white/[0.08] hover:bg-[#181818] hover:text-neutral-100"
      }`}
    >
      {active && <span className="absolute left-0 top-1/2 h-7 w-0.5 -translate-y-1/2 rounded-full bg-cyan-200" />}
      <span className={`grid h-9 w-9 place-items-center rounded-xl border ${active ? "border-cyan-200/25 bg-cyan-200/10 text-cyan-100" : "border-white/[0.08] bg-[#111111] text-neutral-500 group-hover:text-neutral-200"}`}>
        <Icon className="h-4 w-4" />
      </span>
      {!collapsed && (
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">{label}</span>
          <span className="mt-0.5 block truncate text-[11px] text-neutral-500">{description}</span>
        </span>
      )}
    </button>
  );
}
