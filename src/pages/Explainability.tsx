import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Info, ArrowUp, ArrowDown, Brain, FileBarChart, Lightbulb, Pointer } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const shapData = [
  { feature: "Transaction Amount", importance: 0.35, direction: "positive" },
  { feature: "Location Risk Score", importance: 0.28, direction: "positive" },
  { feature: "User History", importance: -0.22, direction: "negative" },
  { feature: "Time of Day", importance: 0.18, direction: "positive" },
  { feature: "Device Trust Score", importance: -0.15, direction: "negative" },
  { feature: "Merchant Category", importance: 0.12, direction: "positive" },
  { feature: "Transaction Velocity", importance: 0.08, direction: "positive" },
  { feature: "Account Age", importance: -0.06, direction: "negative" },
];

const transactionExample = {
  id: "TXN-0002",
  amount: 15000,
  prediction: "Fraud",
  probability: 0.95,
  features: {
    "Transaction Amount": "₹15,000 (unusually high)",
    "Location": "Unknown (VPN detected)",
    "Device": "New device, first time use",
    "Time": "3:42 AM (unusual hour)",
    "Merchant": "Electronics (high-risk category)",
  },
};

const Explainability = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */
         <Navbar />
      }
      <div>
        <h1 className="pt-9 text-3xl font-bold text-foreground">Model Explainability</h1>
        <p className="text-muted-foreground mt-1">
          Understand how our AI makes fraud detection decisions using SHAP and LIME
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-start gap-4">
        <Info className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-foreground">What is Explainable AI?</h3>
          <p className="text-sm text-muted-foreground mt-1">
            SHAP (SHapley Additive exPlanations) and LIME (Local Interpretable Model-agnostic Explanations) 
            are techniques that help explain machine learning predictions by showing which features 
            contributed most to each decision.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SHAP Feature Importance */}
        <div className="lg:col-span-2 bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-accent/10">
              <Brain className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">SHAP Feature Importance</h2>
              <p className="text-sm text-muted-foreground">Global feature contribution to predictions</p>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shapData} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                <XAxis
                  type="number"
                  stroke="hsl(215, 15%, 45%)"
                  fontSize={12}
                  tickLine={false}
                  domain={[-0.3, 0.4]}
                />
                <YAxis
                  type="category"
                  dataKey="feature"
                  stroke="hsl(215, 15%, 45%)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={100}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  // 🔥 THIS REMOVES THE BLACK SHADE
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(214, 20%, 88%)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value: number) => [
                    `${value > 0 ? "+" : ""}${value.toFixed(2)}`,
                    "SHAP Value",
                  ]}
                />

                <Bar  dataKey="importance" radius={[0, 4, 4, 0]} cursor="pointer">
                  {shapData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.importance > 0
                          ? "hsl(0, 72%, 51%)"
                          : "hsl(160, 84%, 39%)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex gap-6 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-fraud" />
              <span className="text-sm text-muted-foreground">Increases fraud risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-success" />
              <span className="text-sm text-muted-foreground">Decreases fraud risk</span>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-warning/10">
              <Lightbulb className="h-5 w-5 text-warning" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Key Insights</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUp className="h-4 w-4 text-fraud" />
                <span className="font-medium text-foreground">Top Risk Factors</span>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Transaction amount significantly impacts risk</li>
                <li>• Unknown locations raise fraud probability</li>
                <li>• Unusual transaction times are flagged</li>
              </ul>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ArrowDown className="h-4 w-4 text-success" />
                <span className="font-medium text-foreground">Trust Indicators</span>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Established user history reduces risk</li>
                <li>• Trusted devices lower fraud probability</li>
                <li>• Older accounts are more trusted</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* LIME Explanation Example */}
      <div className="bg-card p-6 rounded-xl border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileBarChart className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">LIME Explanation Example</h2>
            <p className="text-sm text-muted-foreground">Detailed breakdown for transaction {transactionExample.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Transaction Details */}
          <div className="p-4 bg-fraud/5 border border-fraud/20 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Prediction</span>
              <span className="px-3 py-1 bg-fraud/10 text-fraud font-semibold rounded-full text-sm">
                {transactionExample.prediction} ({(transactionExample.probability * 100).toFixed(0)}%)
              </span>
            </div>

            <div className="space-y-3">
              {Object.entries(transactionExample.features).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{key}</span>
                  <span className="text-foreground font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plain English Explanation */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-foreground mb-3">Plain English Explanation</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This transaction was flagged as <strong className="text-fraud">high-risk fraud</strong> because:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-fraud mt-1.5 flex-shrink-0" />
                <span>The transaction amount of <strong>₹15,000</strong> is significantly higher than the user's typical spending pattern</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-fraud mt-1.5 flex-shrink-0" />
                <span>The transaction originated from an <strong>unknown location</strong> using a VPN service</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-fraud mt-1.5 flex-shrink-0" />
                <span>It was made at <strong>3:42 AM</strong>, outside the user's normal transaction hours</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-fraud mt-1.5 flex-shrink-0" />
                <span>The device has <strong>never been used before</strong> for transactions on this account</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explainability;
