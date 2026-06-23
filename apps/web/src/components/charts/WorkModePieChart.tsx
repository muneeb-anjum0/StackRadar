import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CountItem } from "../../types/api";

const colors = ["#334155", "#64748b", "#94a3b8", "#cbd5e1"];

export function WorkModePieChart({ data }: { data: CountItem[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="name" innerRadius={62} outerRadius={96} paddingAngle={4}>
          {data.map((item, index) => (
            <Cell key={item.name} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", color: "#0f172a", borderRadius: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
