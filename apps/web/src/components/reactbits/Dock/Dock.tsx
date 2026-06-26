import { Page } from "../../shell/types";

export function Dock({
  items,
  active,
  onSelect
}: {
  items: { id: Page; label: string; icon: React.ComponentType<{ className?: string }> }[];
  active: Page;
  onSelect: (page: Page) => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-30 hidden justify-center xl:flex">
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/[0.1] bg-[#151515]/95 px-2 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const selected = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              title={item.label}
              aria-label={item.label}
              onClick={() => onSelect(item.id)}
              className={`cursor-target grid h-11 w-11 place-items-center rounded-full border ${
                selected
                  ? "border-cyan-200/35 bg-[#1c1c1c] text-cyan-100"
                  : "border-transparent text-neutral-500 hover:border-white/[0.1] hover:bg-[#1c1c1c] hover:text-neutral-100"
              }`}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
