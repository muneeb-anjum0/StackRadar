export function EmptyPanel({ title, body }: { title: string; body?: string }) {
  return (
    <div className="rounded-[1.35rem] border border-dashed border-slate-200 bg-white/50 p-8 text-center">
      <p className="font-medium text-slate-900">{title}</p>
      {body && <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>}
    </div>
  );
}
