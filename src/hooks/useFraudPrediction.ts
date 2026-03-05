import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TransactionData {
  amount: number;
  user_id: string;
  transactionTime?: string;
  location: string;
  deviceType: string;
  transactionType: string;
  merchantCategory: string;
}

export const useFraudPrediction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const predict = async (transaction: TransactionData) => {
    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke(
        "analyze-transaction",
        {
          body: {
            transaction: {
              amount: Number(transaction.amount),
              location: transaction.location || "Unknown",
              deviceType: transaction.deviceType || "Unknown",
              transactionType: transaction.transactionType || "Standard",
              merchantCategory: transaction.merchantCategory || "General",
            },
          },
        }
      );

      if (error) throw error;

      const predictionResult = data?.analysis || data;
      setResult(predictionResult);
      return predictionResult;

    } catch (err: any) {
      console.error("Prediction error:", err);
      throw new Error(err.message || "Prediction failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ ADD THIS
  const reset = () => {
    setResult(null);
    setIsLoading(false);
  };

  // ✅ RETURN reset
  return {
    predict,
    isLoading,
    result,
    reset,
  };
};
