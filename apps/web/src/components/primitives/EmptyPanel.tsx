export function EmptyPanel({ title, body }: { title: string; body?: string }) {
  return (
    <div className="rounded-[1.35rem] border border-dashed border-[#252b34] bg-[#090b0e] p-8 text-center">
      <p className="font-medium text-slate-100">{title}</p>
      {body && <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>}
    </div>
  );
}
