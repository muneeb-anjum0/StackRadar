import { AiProvider, AiStatus } from "../../types/api";
import { SegmentedControl } from "../../components/primitives/SegmentedControl";
import { SignalBadge } from "../../components/primitives/SignalBadge";

export function ProviderPanel({ provider, onProvider, status }: { provider: AiProvider | "all"; onProvider: (provider: AiProvider | "all") => void; status?: AiStatus }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white/86 p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Provider mode</p>
      <h2 className="mt-2 text-xl font-semibold text-slate-950">AI is manual and visible</h2>
      <div className="mt-4">
        <SegmentedControl value={provider} onChange={onProvider} options={[{ value: "all", label: "All" }, { value: "mock", label: "Mock" }, { value: "gemini", label: "Gemini" }]} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <SignalBadge tone="good">Mock free/local</SignalBadge>
        <SignalBadge tone={status?.gemini_configured ? "good" : "warn"}>Gemini configured: {status?.gemini_configured ? "yes" : "no"}</SignalBadge>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-500">Changing this filter never calls Gemini. Generation only happens from the Fit Lens report buttons.</p>
    </div>
  );
}
