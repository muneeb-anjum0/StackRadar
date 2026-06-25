export function EmptyPanel({ title, body }: { title: string; body?: string }) {
  return (
    <div className="rounded-[1.35rem] border border-dashed border-white/[0.10] bg-white/[0.04] p-8 text-center">
      <p className="font-medium text-slate-100">{title}</p>
      {body && <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>}
    </div>
  );
}
