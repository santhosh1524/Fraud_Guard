import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TransactionData {
  amount: number;
  location: string;
  deviceType: string;
  transactionType: string;
  merchantCategory: string;
}

interface PredictionResult {
  probability: number;
  riskLevel: "low" | "medium" | "high";
  confidence: number;
  anomalyScore: number;
  recommendation: "approve" | "review" | "block";
  factors: string[];
}

export const useFraudPrediction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const { toast } = useToast();

  const predict = async (transaction: TransactionData) => {
    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke(
        "analyze-transaction",
        {
          body: { transaction },
        }
      );

      if (error) throw error;
      if (!data?.success) {
        throw new Error(data?.error || "Prediction failed");
      }

      const analysis = data.analysis;

      // 🔁 Adapter: backend → UI format
      const adaptedResult: PredictionResult = {
        riskLevel: analysis.risk_level,

        probability:
          analysis.risk_level === "high"
            ? 0.9
            : analysis.risk_level === "medium"
            ? 0.6
            : 0.2,

        anomalyScore:
          analysis.risk_level === "medium" ? 0.65 : 0.15,

        recommendation:
          analysis.risk_level === "high"
            ? "block"
            : analysis.risk_level === "medium"
            ? "review"
            : "approve",

        confidence: analysis.confidence ?? 0.85,
        factors: analysis.factors ?? [],
      };

      setResult(adaptedResult);
      return adaptedResult;
    } catch (err) {
      toast({
        title: "Prediction Failed",
        description:
          err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setIsLoading(false);
  };

  return {
    predict,
    isLoading,
    result,
    reset,
  };
};
