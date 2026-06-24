import { ShellFrame } from "../shell/ShellFrame";
import { Page } from "../shell/types";

export function AppShell({ page, onPage, children }: { page: Page; onPage: (page: Page) => void; children: React.ReactNode }) {
  return <ShellFrame page={page} onPage={onPage}>{children}</ShellFrame>;
}

export type { Page };
