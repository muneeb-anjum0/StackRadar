import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CountItem } from "../../types/api";

export function RoleBarChart({ data }: { data: CountItem[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid stroke="#e5e7eb" vertical={false} />
        <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} interval={0} angle={-20} height={70} />
        <YAxis stroke="#94a3b8" />
        <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", color: "#0f172a", borderRadius: 12 }} />
        <Bar dataKey="count" fill="#64748b" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
