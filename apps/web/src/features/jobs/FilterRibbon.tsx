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
  roleOptions: string[];
  skillOptions: string[];
  sourceOptions: string[];
  onChange: (patch: Partial<{ query: string; role: string; skill: string; workMode: string; source: string; seniority: string }>) => void;
  onReset: () => void;
}) {
  return (
    <div className="grid gap-3 rounded-[1.35rem] border border-slate-200 bg-white/72 p-3 lg:grid-cols-[1fr_repeat(5,150px)_auto]">
      <TextField value={query} onChange={(event) => onChange({ query: event.target.value })} placeholder="Search job evidence" />
      <SelectField value={role} onChange={(event) => onChange({ role: event.target.value })} options={roleOptions} placeholder="Role" />
      <SelectField value={skill} onChange={(event) => onChange({ skill: event.target.value })} options={skillOptions} placeholder="Skill" />
      <SelectField value={workMode} onChange={(event) => onChange({ workMode: event.target.value })} options={["Remote", "Hybrid", "Onsite", "Unknown"]} placeholder="Mode" />
      <SelectField value={seniority} onChange={(event) => onChange({ seniority: event.target.value })} options={["Intern", "Entry Level", "Junior", "Mid-Level", "Senior", "Lead", "Unknown"]} placeholder="Seniority" />
      <SelectField value={source} onChange={(event) => onChange({ source: event.target.value })} options={sourceOptions} placeholder="Source" />
      <SoftButton variant="ghost" onClick={onReset}>Reset</SoftButton>
    </div>
  );
}
