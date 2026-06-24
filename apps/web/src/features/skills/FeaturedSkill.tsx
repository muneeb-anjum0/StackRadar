import { CountItem } from "../../types/api";
import { ProgressLine } from "../../components/primitives/ProgressLine";

export function FeaturedSkill({ skill }: { skill?: CountItem }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white/92 p-7 shadow-[0_30px_90px_rgba(15,23,42,0.09)]">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Featured skill pressure</p>
      <h2 className="mt-5 text-5xl font-semibold tracking-normal text-slate-950">{skill?.name ?? "No skill selected"}</h2>
      <p className="mt-4 text-sm leading-6 text-slate-500">
        {skill?.count ?? 0} clean postings mention this skill. Treat it as a portfolio positioning signal, not a universal market claim.
      </p>
      <ProgressLine value={skill?.percentage ?? 0} className="mt-7" />
      <p className="mt-2 text-xs text-slate-400">{skill?.percentage ?? 0}% of the current StackRadar dataset</p>
    </div>
  );
}
