import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CountItem } from "../../types/api";

export function SkillBarChart({ data }: { data: CountItem[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data.slice(0, 10)} layout="vertical" margin={{ left: 18 }}>
        <CartesianGrid stroke="#e5e7eb" horizontal={false} />
        <XAxis type="number" stroke="#94a3b8" />
        <YAxis dataKey="name" type="category" width={92} stroke="#64748b" />
        <Tooltip cursor={{ fill: "rgba(15,23,42,0.04)" }} contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", color: "#0f172a", borderRadius: 12 }} />
        <Bar dataKey="count" fill="#475569" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
