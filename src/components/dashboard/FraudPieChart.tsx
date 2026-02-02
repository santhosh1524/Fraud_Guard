import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Legitimate", value: 94.2, color: "hsl(160, 84%, 39%)" },
  { name: "Fraud", value: 3.8, color: "hsl(0, 72%, 51%)" },
  { name: "Anomaly", value: 2.0, color: "hsl(25, 95%, 53%)" },
];

const FraudPieChart = () => {
  return (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Transaction Classification</h3>
        <p className="text-sm text-muted-foreground">Distribution of transaction types</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `${value}%`}
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(214, 20%, 88%)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FraudPieChart;
