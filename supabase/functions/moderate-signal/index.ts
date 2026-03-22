import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get unmoderated signals (last 20 without moderation flag)
    const { data: signals, error: fetchErr } = await supabase
      .from("signals")
      .select("id, title, summary, content, category, importance")
      .is("moderated", null)
      .order("created_at", { ascending: false })
      .limit(10);

    if (fetchErr) throw new Error(`Fetch failed: ${fetchErr.message}`);
    if (!signals || signals.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No signals to moderate" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let moderated = 0;
    let removed = 0;

    for (const signal of signals) {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          tools: [
            {
              type: "function",
              function: {
                name: "moderate_signal",
                description: "Moderate a signal for quality and appropriateness",
                parameters: {
                  type: "object",
                  properties: {
                    approved: { type: "boolean", description: "Whether the signal passes moderation" },
                    quality_score: { type: "number", description: "Content quality 1-10" },
                    reason: { type: "string", description: "Brief reason for decision" },
                    adjusted_importance: { type: "number", description: "Adjusted importance score 1-10" },
                  },
                  required: ["approved", "quality_score", "reason", "adjusted_importance"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "moderate_signal" } },
          messages: [
            {
              role: "system",
              content: "You are a content moderator for a tech news platform. Reject low-quality, duplicate-sounding, spam, or inappropriate content. Approve well-written, insightful, and informative signals. Adjust importance scores based on actual newsworthiness.",
            },
            {
              role: "user",
              content: `Moderate this signal:\nTitle: ${signal.title}\nSummary: ${signal.summary}\nCategory: ${signal.category}\nContent preview: ${(signal.content || "").slice(0, 500)}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        console.error(`Moderation AI error for ${signal.id}: ${response.status}`);
        continue;
      }

      const data = await response.json();
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) continue;

      const result = JSON.parse(toolCall.function.arguments);

      if (result.approved) {
        await supabase
          .from("signals")
          .update({
            moderated: true,
            importance: Math.min(10, Math.max(1, result.adjusted_importance)),
          })
          .eq("id", signal.id);
        moderated++;
      } else {
        await supabase.from("signals").delete().eq("id", signal.id);
        removed++;
        console.log(`Removed signal "${signal.title}": ${result.reason}`);
      }
    }

    return new Response(
      JSON.stringify({ success: true, moderated, removed }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("moderate-signal error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
