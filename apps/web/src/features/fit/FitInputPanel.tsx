import { SelectField } from "../../components/primitives/SelectField";
import { SoftButton } from "../../components/primitives/SoftButton";
import { TextField } from "../../components/primitives/TextField";

export function FitInputPanel({
  role,
  skills,
  roles,
  loading,
  onRole,
  onSkills,
  onAnalyze
}: {
  role: string;
  skills: string;
  roles: string[];
  loading: boolean;
  onRole: (role: string) => void;
  onSkills: (skills: string) => void;
  onAnalyze: () => void;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/[0.08] bg-[#121418]/72 p-4">
      <div className="grid gap-3 lg:grid-cols-[220px_1fr_auto]">
        <SelectField value={role} onChange={(event) => onRole(event.target.value)} options={roles} />
        <TextField value={skills} onChange={(event) => onSkills(event.target.value)} placeholder="React, Node.js, MongoDB" />
        <SoftButton variant="primary" onClick={onAnalyze} disabled={loading}>Analyze Fit, no AI</SoftButton>
      </div>
      <p className="mt-3 text-xs text-slate-500">Analyze Fit uses StackRadar analytics only. No AI call happens here.</p>
    </div>
  );
}
