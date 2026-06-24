import { SourceHealth, SourceSummary } from "../../types/api";
import { PipelineLedger } from "../../components/visuals/PipelineLedger";

export function SourceHealthLedger({ sources, health }: { sources?: SourceSummary; health: SourceHealth[] }) {
  return <PipelineLedger sources={sources?.sources ?? []} health={health} />;
}
