import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { range: "0-0.2", count: 4500, color: "success" },
  { range: "0.2-0.4", count: 2800, color: "success" },
  { range: "0.4-0.6", count: 1200, color: "warning" },
  { range: "0.6-0.8", count: 450, color: "warning" },
  { range: "0.8-1.0", count: 180, color: "fraud" },
];

const AnomalyScoreChart = () => {
  return (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Anomaly Score Distribution</h3>
        <p className="text-sm text-muted-foreground">Transaction count by risk score range</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
            <XAxis
              dataKey="range"
              stroke="hsl(215, 15%, 45%)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="hsl(215, 15%, 45%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(214, 20%, 88%)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Bar
              dataKey="count"
              fill="hsl(195, 85%, 45%)"
              radius={[4, 4, 0, 0]}
              name="Transactions"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnomalyScoreChart;
