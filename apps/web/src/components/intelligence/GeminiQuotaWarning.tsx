import { Button } from "../ui/Button";

export function GeminiQuotaWarning({
  confirmed,
  onConfirm,
  cooldownRemaining
}: {
  confirmed: boolean;
  onConfirm: () => void;
  cooldownRemaining: number;
}) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-900">
      <p className="font-semibold">Gemini uses your API quota. Use it only when you need a polished real AI report.</p>
      <p className="mt-2 leading-6">StackRadar will not call Gemini on page load, refresh, or normal skill-gap analysis.</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {!confirmed && <Button onClick={onConfirm}>I understand</Button>}
        {confirmed && <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-amber-800">Confirmed for this session</span>}
        {cooldownRemaining > 0 && <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-amber-800">{cooldownRemaining}s cooldown</span>}
      </div>
    </div>
  );
}
