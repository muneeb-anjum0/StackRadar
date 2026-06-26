import { CountItem } from "../../types/api";
import { ProgressLine } from "../../components/primitives/ProgressLine";
import { GlowPanel } from "../../components/ui/GlowPanel";

export function FeaturedSkill({ skill }: { skill?: CountItem }) {
  return (
    <GlowPanel tone="violet">
      <div className="grid gap-5 rounded-[1.5rem] p-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">Strongest skill signal</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-normal text-neutral-50 md:text-5xl">{skill?.name ?? "No skill selected"}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-400">
            {skill?.count ?? 0} clean postings mention this skill. Treat it as a portfolio positioning signal, not a universal market claim.
          </p>
        </div>
        <div className="rounded-[1.25rem] border border-white/[0.08] bg-[#111111] p-5">
          <ProgressLine value={skill?.percentage ?? 0} />
          <p className="mt-3 text-sm text-neutral-400">Appears in {skill?.percentage ?? 0}% of clean jobs</p>
        </div>
      </div>
    </GlowPanel>
  );
}
