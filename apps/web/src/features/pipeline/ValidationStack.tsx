import { ValidationCheck } from "../../types/api";
import { SignalBadge } from "../../components/primitives/SignalBadge";

export function ValidationStack({ checks }: { checks: ValidationCheck[] }) {
  return (
    <div className="space-y-3">
      {checks.map((check) => (
        <div key={check.check_name} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium capitalize text-slate-950">{check.check_name.replace(/_/g, " ")}</p>
            <SignalBadge tone={check.status === "passed" ? "good" : "warn"}>{check.status}</SignalBadge>
          </div>
          <p className="mt-2 text-xs text-slate-500">{check.failed_count} failed of {check.total_count} / {check.severity}</p>
          {check.message && <p className="mt-2 text-sm leading-6 text-slate-500">{check.message}</p>}
        </div>
      ))}
    </div>
  );
}
