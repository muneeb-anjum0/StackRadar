import { AiProvider, AiStatus, AiUsage, ReportType } from "../../types/api";
import { GeminiQuotaWarning } from "./GeminiQuotaWarning";
import { ProviderSwitch } from "./ProviderSwitch";
import { ReportTypePicker } from "./ReportTypePicker";
import { UsageNotice } from "./UsageNotice";

export function AiActionPanel({
  provider,
  onProvider,
  status,
  confirmed,
  onConfirm,
  cooldownRemaining,
  disabled,
  activeType,
  onGenerate,
  sessionCount,
  usage
}: {
  provider: AiProvider;
  onProvider: (provider: AiProvider) => void;
  status?: AiStatus;
  confirmed: boolean;
  onConfirm: () => void;
  cooldownRemaining: number;
  disabled?: boolean;
  activeType?: ReportType | null;
  onGenerate: (type: ReportType) => void;
  sessionCount: number;
  usage?: AiUsage;
}) {
  const geminiNeedsConfirm = provider === "gemini" && !confirmed;
  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">AI career intelligence</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-950">Generate one manual brief at a time</h2>
        </div>
        <ProviderSwitch provider={provider} onChange={onProvider} status={status} />
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-500">Mock is deterministic and free. Gemini uses your API quota. Use only when needed.</p>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_260px]">
        <div className="space-y-4">
          {provider === "gemini" && (
            <GeminiQuotaWarning confirmed={confirmed} onConfirm={onConfirm} cooldownRemaining={cooldownRemaining} />
          )}
          <ReportTypePicker onPick={onGenerate} disabled={disabled || geminiNeedsConfirm} activeType={activeType} />
        </div>
        <UsageNotice usage={usage} sessionCount={sessionCount} />
      </div>
    </section>
  );
}
