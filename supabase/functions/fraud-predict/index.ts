import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Updated to match the fields sent by Predict.tsx
interface TransactionData {
  amount: number;
  user_id: string; // Added user_id
  location: string;
  deviceType: string;
  transactionType: string;
  merchantCategory: string;
}

serve(async (req) => {
  // Handle CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const HF_API_KEY = Deno.env.get("HF_API_KEY");
    if (!HF_API_KEY) {
      throw new Error("HF_API_KEY not found in Edge Function secrets");
    }

    const body = await req.json();
    
    // Support both { transaction: ... } and direct object formats
    const transaction = (body.transaction || body) as TransactionData;

    if (!transaction || typeof transaction.amount !== "number") {
      throw new Error("Invalid transaction payload: amount is required and must be a number");
    }

    /* ------------------------------------------------
        SIMPLE & SAFE FRAUD LOGIC
    ------------------------------------------------ */
    let riskLevel: "low" | "medium" | "high" = "low";
    let fraudStatus: "normal" | "anomaly" | "fraud" = "normal";

    // Example logic: High amount triggers high risk
    if (transaction.amount > 50000) {
      riskLevel = "high";
      fraudStatus = "fraud";
    } else if (
      transaction.location === "Unknown" ||
      transaction.deviceType === "Unknown"
    ) {
      riskLevel = "medium";
      fraudStatus = "anomaly";
    }

    // Calculate a basic probability score (0 to 1)
    const probability = Math.min(1, transaction.amount / 100000);

    /* ------------------------------------------------
        RESPONSE
    ------------------------------------------------ */
    const responseData = {
      success: true,
      analysis: {
        riskLevel,
        fraudStatus,
        probability,
        confidence: 0.85,
        anomalyScore: probability,
        recommendation:
          riskLevel === "high"
            ? "block"
            : riskLevel === "medium"
            ? "review"
            : "approve",
        factors: [
          `User ID: ${transaction.user_id || 'Unknown'}`, // Included user_id in factors
          `Amount: ${transaction.amount}`,
          `Location: ${transaction.location}`,
          `Device: ${transaction.deviceType}`,
          `Merchant: ${transaction.merchantCategory}`,
        ],
      },
    };

    return new Response(
      JSON.stringify(responseData),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }catch (error) {
    // Narrow the type from 'unknown' to 'Error'
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    
    console.error(`Edge Function Error: ${errorMessage}`);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});