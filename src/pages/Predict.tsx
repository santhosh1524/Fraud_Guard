import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, AlertTriangle, CheckCircle, AlertCircle, Loader2, ShieldAlert, ShieldCheck, Eye } from "lucide-react";
import { useFraudPrediction } from "@/hooks/useFraudPrediction";
import { useCreateTransaction, useUpdateTransaction } from "@/hooks/useTransactions";
import Navbar from "@/components/layout/Navbar";

const Predict = () => {
  const [formData, setFormData] = useState({
    amount: "",
    userId: "",
    location: "",
    deviceType: "",
    transactionType: "",
    merchantCategory: "",
  });

  const { predict, isLoading, result, reset } = useFraudPrediction();
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const analysis = await predict({
      amount: parseFloat(formData.amount),
      userId: formData.userId,
      location: formData.location,
      deviceType: formData.deviceType,
      transactionType: formData.transactionType,
      merchantCategory: formData.merchantCategory,
    });

    // Optionally create a transaction record with the prediction
    if (analysis) {
      createTransaction.mutate({
        transaction_id: `TXN-${Date.now().toString(36).toUpperCase()}`,
        amount: parseFloat(formData.amount),
        location: formData.location,
        device_type: formData.deviceType,
        transaction_type: formData.transactionType,
        category: formData.merchantCategory,
        status: "completed",
        fraud_status: analysis.riskLevel === "high" ? "fraud" : analysis.riskLevel === "medium" ? "anomaly" : "normal",
        fraud_probability: analysis.probability,
        risk_level: analysis.riskLevel,
        anomaly_score: analysis.anomalyScore,
        prediction_factors: analysis.factors as unknown as any,
      });
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-fraud";
      case "medium":
        return "text-warning";
      case "low":
        return "text-success";
      default:
        return "text-muted-foreground";
    }
  };

  const getRiskBg = (level: string) => {
    switch (level) {
      case "high":
        return "bg-fraud/10 border-fraud/30";
      case "medium":
        return "bg-warning/10 border-warning/30";
      case "low":
        return "bg-success/10 border-success/30";
      default:
        return "bg-muted border-border";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "high":
        return <AlertTriangle className="h-8 w-8 text-fraud" />;
      case "medium":
        return <AlertCircle className="h-8 w-8 text-warning" />;
      case "low":
        return <CheckCircle className="h-8 w-8 text-success" />;
      default:
        return null;
    }
  };

  const getRecommendationIcon = (rec: string) => {
    switch (rec) {
      case "block":
        return <ShieldAlert className="h-5 w-5 text-fraud" />;
      case "review":
        return <Eye className="h-5 w-5 text-warning" />;
      case "approve":
        return <ShieldCheck className="h-5 w-5 text-success" />;
      default:
        return null;
    }
  };

  const handleReset = () => {
    reset();
    setFormData({
      amount: "",
      userId: "",
      location: "",
      deviceType: "",
      transactionType: "",
      merchantCategory: "",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */
         <Navbar />
      }
      <div>
        <h1 className="pt-9 text-3xl font-bold text-foreground">AI Fraud Prediction</h1>
        <p className="text-muted-foreground mt-1">
          Enter transaction details to get real-time AI-powered fraud risk analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-6">Transaction Details</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userId">Transaction ID</Label>
                <Input
                  id="userId"
                  placeholder="TNX-XXXX"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => setFormData({ ...formData, location: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New York, US">New York, US</SelectItem>
                    <SelectItem value="London, UK">London, UK</SelectItem>
                    <SelectItem value="Tokyo, JP">Tokyo, JP</SelectItem>
                    <SelectItem value="Paris, FR">Paris, FR</SelectItem>
                    <SelectItem value="Unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deviceType">Device Type</Label>
                <Select
                  value={formData.deviceType}
                  onValueChange={(value) => setFormData({ ...formData, deviceType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select device" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mobile">Mobile</SelectItem>
                    <SelectItem value="Desktop">Desktop</SelectItem>
                    <SelectItem value="Tablet">Tablet</SelectItem>
                    <SelectItem value="Unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transactionType">Transaction Type</Label>
                <Select
                  value={formData.transactionType}
                  onValueChange={(value) => setFormData({ ...formData, transactionType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                    <SelectItem value="withdrawal">Withdrawal</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="merchantCategory">Merchant Category</Label>
                <Select
                  value={formData.merchantCategory}
                  onValueChange={(value) => setFormData({ ...formData, merchantCategory: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" variant="accent" size="lg" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    Predict Fraud Risk
                  </>
                )}
              </Button>
              {result && (
                <Button type="button" variant="outline" size="lg" onClick={handleReset}>
                  Reset
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Results Panel */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-6">AI Prediction Results</h2>

          {!result && !isLoading && (
            <div className="h-64 flex items-center justify-center text-center">
              <div>
                <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Enter transaction details and click "Predict" to see AI-powered results
                </p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full border-4 border-accent/30 border-t-accent animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">AI is analyzing transaction...</p>
              </div>
            </div>
          )}

          {result && !isLoading && (
            <div className="space-y-6">
              {/* Risk Level Card */}
              <div className={`p-6 rounded-xl border-2 ${getRiskBg(result.riskLevel)}`}>
                <div className="flex items-center gap-4">
                  {getRiskIcon(result.riskLevel)}
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Level</p>
                    <p className={`text-2xl font-bold capitalize ${getRiskColor(result.riskLevel)}`}>
                      {result.riskLevel} Risk
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              <div className="p-4 bg-muted/50 rounded-lg flex items-center gap-3">
                {getRecommendationIcon(result.recommendation)}
                <div>
                  <p className="text-sm text-muted-foreground">Recommendation</p>
                  <p className="font-medium text-foreground capitalize">{result.recommendation} Transaction</p>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Fraud Probability</p>
                  <p className="text-2xl font-bold text-foreground">
                    {(result.probability * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Confidence</p>
                  <p className="text-2xl font-bold text-foreground">
                    {(result.confidence * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Anomaly Score</p>
                  <p className="text-2xl font-bold text-foreground">
                    {(result.anomalyScore * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Contributing Factors */}
              <div>
                <p className="text-sm font-medium text-foreground mb-3">Contributing Factors</p>
                <ul className="space-y-2">
                  {result.factors.map((factor, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className={`w-2 h-2 rounded-full ${
                        result.riskLevel === "high"
                          ? "bg-fraud"
                          : result.riskLevel === "medium"
                          ? "bg-warning"
                          : "bg-success"
                      }`} />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Predict;
