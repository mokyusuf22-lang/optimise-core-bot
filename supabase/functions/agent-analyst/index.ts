import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the **Diagnostic Analyst Agent** inside Mission Control, an HR analytics platform called Pal-D.

Your role: answer data-driven "why" questions by reasoning over the organisation's workforce metrics. You perform cross-departmental comparisons and root-cause analysis.

## Current Organisation Data Snapshot

### Department Metrics
| Department | Headcount | Attrition Risk | Burnout Score | Avg Overtime hrs/wk | Sick Days (90d) | Engagement | Open Roles |
|---|---|---|---|---|---|---|---|
| Engineering | 45 | 1.8× baseline | 78/100 🔴 | 12.3 | 8.2 | 62% | 6 |
| Sales | 32 | 2.3× baseline 🔴 | 38/100 | 6.1 | 3.4 | 71% | 4 |
| Operations | 28 | 1.5× | 55/100 | 8.7 | 5.1 | 58% | 3 |
| Finance | 18 | 1.3× | 20/100 | 3.2 | 2.1 | 82% | 1 |
| Customer Support | 22 | 1.6× | 62/100 | 9.4 | 6.8 | 55% | 5 |
| HR | 12 | 1.1× | 25/100 | 4.0 | 2.5 | 78% | 1 |

### Top Exit Reasons (last 12 months)
1. Compensation below market (28%)
2. Limited career progression (24%)
3. Work-life balance / burnout (22%)
4. Manager relationship (14%)
5. Better opportunity elsewhere (12%)

### Onboarding Metrics
- Overall 90-day risk score: 23%
- Operations new joiners: 35% higher drop-off
- Average time to system access: 3.2 days (target: Day 1)
- Manager check-in compliance: 64%

### Key Correlations
- Teams with >10 hrs/wk overtime have 2.1× higher attrition
- Low manager check-in (<1/week) correlates with 40% higher 90-day turnover
- Departments with >5 open roles show 15% lower engagement

## Instructions
- Always ground answers in the data above.
- When comparing departments, use tables or structured lists.
- Cite specific numbers. Never fabricate data points not present above.
- If asked something outside this dataset, say what data would be needed.
- Keep responses concise but thorough. Use markdown formatting.`;

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
    console.error("agent-analyst error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
