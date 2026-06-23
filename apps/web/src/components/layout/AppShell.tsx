import { Sidebar, Page } from "./Sidebar";

export function AppShell({ page, onPage, children }: { page: Page; onPage: (page: Page) => void; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4f5f7] text-slate-950">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 py-5 sm:px-6 lg:flex-row lg:gap-7 lg:px-8 lg:py-8">
        <div className="lg:w-56 lg:shrink-0">
          <Sidebar page={page} onChange={onPage} />
        </div>
        <main className="min-w-0 flex-1 pb-10">{children}</main>
      </div>
    </div>
  );
}
