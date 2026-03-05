import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert, Json } from "@/integrations/supabase/types";

/* =========================================================
   TYPES
========================================================= */

export type Transaction = Tables<"transactions">;
type CreateTransactionInput = TablesInsert<"transactions">;

/* =========================================================
   GET TRANSACTIONS
========================================================= */
export const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      console.log("Fetching transactions...");

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      console.log("DATA:", data);
      console.log("ERROR:", error);

      if (error) throw error;

      return data ?? [];
    },
  });
};

/* =========================================================
   STATS
========================================================= */

export const useTransactionStats = () => {
  return useQuery({
    queryKey: ["transaction-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("fraud_status, risk_level, amount");

      if (error) {
        console.error("Stats fetch error:", error);
        throw error;
      }

      const transactions = data ?? [];

      const total = transactions.length;
      const fraud = transactions.filter((t) => t.fraud_status === "fraud").length;
      const anomaly = transactions.filter((t) => t.fraud_status === "anomaly").length;
      const normal = transactions.filter((t) => t.fraud_status === "normal").length;

      return {
        total,
        fraud,
        anomaly,
        normal,
        fraudRate: total ? (fraud / total) * 100 : 0,
        anomalyRate: total ? (anomaly / total) * 100 : 0,
      };
    },
  });
};

/* =========================================================
   CREATE TRANSACTION
========================================================= */

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (transaction: CreateTransactionInput) => {
      const { data, error } = await supabase
        .from("transactions")
        .insert(transaction)
        .select()
        .single();

      if (error) throw error;

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transaction-stats"] });

      toast({
        title: "Transaction Created",
        description: "The transaction has been successfully recorded.",
      });
    },

    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

/* =========================================================
   UPDATE TRANSACTION
========================================================= */

interface UpdateTransactionInput {
  id: string;
  fraud_status?: string;
  fraud_probability?: number | null;
  risk_level?: string | null;
  anomaly_score?: number | null;
  prediction_factors?: Json | null;
  status?: string;
}

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateTransactionInput) => {
      const { data, error } = await supabase
        .from("transactions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transaction-stats"] });
    },

    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};