import { BarChart3, Bot, BriefcaseBusiness, GitBranch, Layers3, Route, Wrench } from "lucide-react";
import { Page } from "../shell/types";

export const lenses: {
  id: Page;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "overview", label: "Market", description: "overall signal", icon: BarChart3 },
  { id: "skills", label: "Skills", description: "demanded skills", icon: Wrench },
  { id: "roles", label: "Roles", description: "role blueprint", icon: Layers3 },
  { id: "jobs", label: "Jobs", description: "evidence records", icon: BriefcaseBusiness },
  { id: "gap", label: "Career Plan", description: "personal path", icon: Route },
  { id: "intelligence", label: "AI Reports", description: "report archive", icon: Bot },
  { id: "quality", label: "Pipeline", description: "trust ledger", icon: GitBranch }
];

export function lensFor(page: Page) {
  return lenses.find((lens) => lens.id === page) ?? lenses[0];
}
