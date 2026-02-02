import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TransactionData {
  amount: number;
  userId: string;
  location: string;
  deviceType: string;
  transactionType: string;
  merchantCategory: string;
  ipAddress?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { transaction } = await req.json() as { transaction: TransactionData };

    console.log("Analyzing transaction:", transaction);

    const systemPrompt = `You are an AI fraud detection system. Analyze the following transaction and determine its fraud risk.

You must respond ONLY by calling the analyze_fraud function with your analysis. Do not provide any other text.

Factors to consider:
1. Transaction amount - higher amounts are riskier
2. Location - unknown or high-risk locations increase fraud probability
3. Device type - unknown devices are suspicious
4. Transaction type - certain types (withdrawals, transfers) are riskier
5. Merchant category - some categories are more prone to fraud
6. Pattern recognition - unusual patterns for the user

Risk levels:
- low: probability < 0.3
- medium: probability 0.3 - 0.7  
- high: probability > 0.7`;

    const userPrompt = `Analyze this transaction for fraud:
- Amount: $${transaction.amount}
- User ID: ${transaction.userId}
- Location: ${transaction.location}
- Device Type: ${transaction.deviceType}
- Transaction Type: ${transaction.transactionType}
- Merchant Category: ${transaction.merchantCategory}
${transaction.ipAddress ? `- IP Address: ${transaction.ipAddress}` : ""}

Determine the fraud probability (0-1), risk level (low/medium/high), confidence score (0-1), and list the key factors that influenced your decision.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_fraud",
              description: "Return fraud analysis results for the transaction",
              parameters: {
                type: "object",
                properties: {
                  probability: {
                    type: "number",
                    description: "Fraud probability between 0 and 1",
                  },
                  riskLevel: {
                    type: "string",
                    enum: ["low", "medium", "high"],
                    description: "Overall risk level",
                  },
                  confidence: {
                    type: "number",
                    description: "Model confidence between 0 and 1",
                  },
                  factors: {
                    type: "array",
                    items: { type: "string" },
                    description: "Key factors that influenced the decision",
                  },
                  anomalyScore: {
                    type: "number",
                    description: "Anomaly score between 0 and 1",
                  },
                  recommendation: {
                    type: "string",
                    enum: ["approve", "review", "block"],
                    description: "Recommended action",
                  },
                },
                required: ["probability", "riskLevel", "confidence", "factors", "anomalyScore", "recommendation"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_fraud" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log("AI Response:", JSON.stringify(aiResponse, null, 2));

    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "analyze_fraud") {
      throw new Error("Invalid AI response format");
    }

    const analysis = JSON.parse(toolCall.function.arguments);
    console.log("Fraud analysis result:", analysis);

    return new Response(
      JSON.stringify({
        success: true,
        analysis: {
          probability: analysis.probability,
          riskLevel: analysis.riskLevel,
          confidence: analysis.confidence,
          factors: analysis.factors,
          anomalyScore: analysis.anomalyScore,
          recommendation: analysis.recommendation,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Fraud prediction error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
