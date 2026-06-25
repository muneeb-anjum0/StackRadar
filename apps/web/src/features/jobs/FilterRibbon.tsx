import { SelectField } from "../../components/primitives/SelectField";
import { SoftButton } from "../../components/primitives/SoftButton";
import { TextField } from "../../components/primitives/TextField";

export function FilterRibbon({
  query,
  role,
  skill,
  workMode,
  source,
  seniority,
  salaryAvailable,
  hasSkills,
  hideNonTechnical,
  showLowConfidence,
  roleOptions,
  skillOptions,
  sourceOptions,
  onChange,
  onReset
}: {
  query: string;
  role: string;
  skill: string;
  workMode: string;
  source: string;
  seniority: string;
  salaryAvailable: boolean;
  hasSkills: boolean;
  hideNonTechnical: boolean;
  showLowConfidence: boolean;
  roleOptions: string[];
  skillOptions: string[];
  sourceOptions: string[];
  onChange: (patch: Partial<{ query: string; role: string; skill: string; workMode: string; source: string; seniority: string; salaryAvailable: boolean; hasSkills: boolean; hideNonTechnical: boolean; showLowConfidence: boolean }>) => void;
  onReset: () => void;
}) {
  return (
    <div className="rounded-[1.25rem] border border-[#20242b] bg-[#0b0d10] p-3">
      <div className="grid gap-3 lg:grid-cols-[1fr_repeat(5,150px)_auto]">
      <TextField value={query} onChange={(event) => onChange({ query: event.target.value })} placeholder="Search job evidence" />
      <SelectField value={role} onChange={(event) => onChange({ role: event.target.value })} options={roleOptions} placeholder="Role" />
      <SelectField value={skill} onChange={(event) => onChange({ skill: event.target.value })} options={skillOptions} placeholder="Skill" />
      <SelectField value={workMode} onChange={(event) => onChange({ workMode: event.target.value })} options={["Remote", "Hybrid", "Onsite", "Unknown"]} placeholder="Mode" />
      <SelectField value={seniority} onChange={(event) => onChange({ seniority: event.target.value })} options={["Intern", "Entry Level", "Junior", "Mid-Level", "Senior", "Lead", "Unknown"]} placeholder="Seniority" />
      <SelectField value={source} onChange={(event) => onChange({ source: event.target.value })} options={sourceOptions} placeholder="Source" />
      <SoftButton variant="ghost" onClick={onReset}>Reset</SoftButton>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Toggle label="Salary available" checked={salaryAvailable} onChange={(checked) => onChange({ salaryAvailable: checked })} />
        <Toggle label="Has extracted skills" checked={hasSkills} onChange={(checked) => onChange({ hasSkills: checked })} />
        <Toggle label="Hide non-technical jobs" checked={hideNonTechnical} onChange={(checked) => onChange({ hideNonTechnical: checked })} />
        <Toggle label="Show low-confidence jobs" checked={showLowConfidence} onChange={(checked) => onChange({ showLowConfidence: checked })} />
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${checked ? "border-[#3a404a] bg-[#151a20] text-white" : "border-[#252b34] bg-[#07090b] text-slate-400"}`}>
      <input className="sr-only" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className={`h-2 w-2 rounded-full ${checked ? "bg-emerald-300" : "bg-slate-600"}`} />
      {label}
    </label>
  );
}
