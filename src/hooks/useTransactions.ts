import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";

export interface Transaction {
  id: string;
  transaction_id: string;
  user_id: string | null;
  amount: number;
  merchant: string | null;
  category: string | null;
  location: string | null;
  device_type: string | null;
  ip_address: string | null;
  transaction_type: string | null;
  status: string;
  fraud_status: string;
  fraud_probability: number | null;
  risk_level: string | null;
  anomaly_score: number | null;
  prediction_factors: Json | null;
  created_at: string;
  analyzed_at: string | null;
}

export const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        throw error;
      }

      return data as Transaction[];
    },
  });
};

export const useTransactionStats = () => {
  return useQuery({
    queryKey: ["transaction-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("fraud_status, risk_level, amount");

      if (error) {
        throw error;
      }

      const total = data.length;
      const fraud = data.filter((t) => t.fraud_status === "fraud").length;
      const anomaly = data.filter((t) => t.fraud_status === "anomaly").length;
      const normal = data.filter((t) => t.fraud_status === "normal").length;

      return {
        total,
        fraud,
        anomaly,
        normal,
        fraudRate: total > 0 ? (fraud / total) * 100 : 0,
        anomalyRate: total > 0 ? (anomaly / total) * 100 : 0,
      };
    },
  });
};

interface CreateTransactionInput {
  transaction_id: string;
  amount: number;
  merchant?: string;
  category?: string;
  location?: string;
  device_type?: string;
  ip_address?: string;
  transaction_type?: string;
  status?: string;
  fraud_status?: string;
  fraud_probability?: number;
  risk_level?: string;
  anomaly_score?: number;
  prediction_factors?: Json;
}

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (transaction: CreateTransactionInput) => {
      const { data, error } = await supabase
        .from("transactions")
        .insert([transaction])
        .select()
        .single();

      if (error) {
        throw error;
      }

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
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

interface UpdateTransactionInput {
  id: string;
  fraud_status?: string;
  fraud_probability?: number;
  risk_level?: string;
  anomaly_score?: number;
  prediction_factors?: Json;
  analyzed_at?: string;
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

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transaction-stats"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
