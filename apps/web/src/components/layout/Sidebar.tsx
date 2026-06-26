import { ChevronLeft, ChevronRight, Radar } from "lucide-react";
import { Page } from "../shell/types";
import { lenses } from "./navigation";
import { SidebarItem } from "./SidebarItem";

export function Sidebar({
  page,
  collapsed,
  onPage,
  onCollapsed
}: {
  page: Page;
  collapsed: boolean;
  onPage: (page: Page) => void;
  onCollapsed: (collapsed: boolean) => void;
}) {
  return (
    <aside className={`hidden h-screen shrink-0 p-4 pr-5 lg:sticky lg:top-0 lg:block ${collapsed ? "w-[92px]" : "w-[280px]"}`}>
      <div className="relative flex h-full flex-col overflow-visible rounded-[1.5rem] border border-white/[0.08] bg-[#151515] p-3">
        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => onCollapsed(!collapsed)}
          className="cursor-target absolute -right-5 top-7 grid h-10 w-10 place-items-center rounded-full border border-white/[0.12] bg-[#1c1c1c] text-neutral-100 hover:border-cyan-200/35 hover:text-cyan-100"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        <div className={`mb-6 flex items-center gap-3 px-2 pt-1 ${collapsed ? "justify-center" : ""}`}>
          <div className="grid h-10 w-10 place-items-center rounded-2xl border border-cyan-200/20 bg-[#111111] text-cyan-100">
            <Radar className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold tracking-normal text-neutral-50">StackRadar</p>
              <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-600">Career cockpit</p>
            </div>
          )}
        </div>

        <nav className="premium-scroll grid gap-1.5 overflow-y-auto">
          {lenses.map((lens) => (
            <SidebarItem
              key={lens.id}
              {...lens}
              active={page === lens.id}
              collapsed={collapsed}
              onSelect={onPage}
            />
          ))}
        </nav>

        <div className={`mt-auto rounded-[1.2rem] border border-white/[0.08] bg-[#111111] p-3 ${collapsed ? "grid place-items-center" : ""}`}>
          <div className="grid h-9 w-9 place-items-center rounded-full border border-emerald-200/20 bg-emerald-300/10">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
          </div>
          {!collapsed && (
            <div className="mt-3">
              <p className="text-xs font-medium text-neutral-200">Live Market Snapshot</p>
              <p className="mt-1 text-[11px] leading-4 text-neutral-500">API-backed signals, quality checked.</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
