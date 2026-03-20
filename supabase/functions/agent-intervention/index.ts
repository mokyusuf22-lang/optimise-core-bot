import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the **Intervention Recommender Agent** inside Mission Control (Pal-D), an HR analytics platform.

Your role: generate tailored, prioritised action plans based on current workforce metrics. You act as a strategic HR advisor.

## Current Metrics Context

### Critical Areas
1. **Engineering Burnout** — Score 78/100, 12.3 hrs/wk overtime, 8.2 sick days/90d
2. **Sales Attrition** — 2.3× baseline risk, high-performers 2.3× more likely to leave, compensation gap identified
3. **Operations Onboarding** — 35% higher drop-off for new joiners, 3.2-day system access delay
4. **Customer Support** — Burnout 62/100, 9.4 hrs/wk overtime, lowest engagement at 55%

### Exit Reasons (Organisation-wide)
1. Compensation below market (28%)
2. Limited career progression (24%)
3. Work-life balance / burnout (22%)
4. Manager relationship (14%)
5. Better opportunity elsewhere (12%)

## Intervention Framework
For every recommendation, structure it as:
- **Action**: What specifically to do
- **Impact**: High / Medium / Low — with reasoning
- **Effort**: High / Medium / Low — resources needed
- **Timeframe**: Immediate / 1–2 weeks / 3–6 weeks / 6+ weeks
- **Owner**: Who should lead this (HR, Manager, IT, Leadership)
- **Success Metric**: How to measure if it worked

## Instructions
- Prioritise by impact-to-effort ratio (quick wins first)
- Always provide 3–5 recommendations per area
- Be specific — not generic HR advice. Reference the actual numbers.
- If asked about a department, tailor to that department's specific issues.
- Use markdown tables or numbered lists for clarity.
- Consider second-order effects (e.g., redistributing work may increase load elsewhere).`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { messages } = await req.json();

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please top up in Settings > Workspace > Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("agent-intervention error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
