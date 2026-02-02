import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", transactions: 4000, fraud: 24 },
  { name: "Feb", transactions: 3000, fraud: 13 },
  { name: "Mar", transactions: 5000, fraud: 38 },
  { name: "Apr", transactions: 4500, fraud: 20 },
  { name: "May", transactions: 6000, fraud: 45 },
  { name: "Jun", transactions: 5500, fraud: 30 },
  { name: "Jul", transactions: 7000, fraud: 52 },
  { name: "Aug", transactions: 6500, fraud: 35 },
  { name: "Sep", transactions: 8000, fraud: 60 },
  { name: "Oct", transactions: 7500, fraud: 48 },
  { name: "Nov", transactions: 9000, fraud: 70 },
  { name: "Dec", transactions: 8500, fraud: 55 },
];

const TransactionChart = () => {
  return (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Transaction Volume Over Time</h3>
        <p className="text-sm text-muted-foreground">Monthly transaction trends with fraud detection</p>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(195, 85%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(195, 85%, 45%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
            <XAxis 
              dataKey="name" 
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
            <Area
              type="monotone"
              dataKey="transactions"
              stroke="hsl(195, 85%, 45%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTransactions)"
              name="Transactions"
            />
            <Area
              type="monotone"
              dataKey="fraud"
              stroke="hsl(0, 72%, 51%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorFraud)"
              name="Fraud Detected"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TransactionChart;
