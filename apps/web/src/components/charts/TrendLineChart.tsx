import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Trend = { date: string; skill: string; job_count: number };

export function TrendLineChart({ data }: { data: Trend[] }) {
  const compact = data.slice(0, 18).map((item) => ({ date: item.date.slice(5), count: item.job_count, skill: item.skill }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={compact}>
        <XAxis dataKey="date" stroke="#64748b" />
        <YAxis stroke="#94a3b8" />
        <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", color: "#0f172a", borderRadius: 12 }} />
        <Line dataKey="count" stroke="#475569" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
