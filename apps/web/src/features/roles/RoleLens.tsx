import { useState } from "react";
import { LensHeader } from "../../components/shell/LensHeader";
import { Surface } from "../../components/primitives/Surface";
import { LoadingPanel } from "../../components/primitives/LoadingPanel";
import { DemandBars } from "../../components/visuals/DemandBars";
import { RoleBlueprint } from "../../components/visuals/RoleBlueprint";
import { useRoleData } from "../../hooks/useRoleData";
import { RoleCompareTray } from "./RoleCompareTray";
import { RoleSwitcher } from "./RoleSwitcher";

export function RoleLens() {
  const [role, setRole] = useState("Backend Developer");
  const { roles, detail, roleOptions } = useRoleData(role);
  const data = detail.data;
  if (detail.isLoading && !data) return <LoadingPanel label="Drafting role blueprint" />;

  return (
    <div className="space-y-7">
      <LensHeader
        eyebrow="Role Lens"
        title="Roles"
        subtitle="Pick a role and see the skill stack, conditions and nearby alternatives."
      />
      <RoleSwitcher role={role} roles={roleOptions} onRole={setRole} />
      {data && (
        <>
          <Surface level={3} className="p-7">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Role Blueprint</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-100">{data.role}</h2>
            </div>
            <RoleBlueprint role={data} />
          </Surface>
          <div className="grid gap-6 xl:grid-cols-[0.72fr_1fr]">
            <Surface level={2} className="p-5">
              <h3 className="mb-4 font-semibold text-slate-100">Skill requirement bars</h3>
              <DemandBars items={data.top_skills} limit={7} />
            </Surface>
            <Surface level={2} className="p-5">
              <h3 className="font-semibold text-slate-100">Nearby roles to compare</h3>
              <p className="mt-1 mb-4 text-sm leading-6 text-slate-500">Nearby roles are role clusters close in demand or skill overlap.</p>
              <RoleCompareTray roles={roles.data ?? []} selected={role} />
            </Surface>
          </div>
        </>
      )}
    </div>
  );
}
