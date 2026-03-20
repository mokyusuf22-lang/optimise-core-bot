import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the **Onboarding Concierge Agent** inside Mission Control (Pal-D), an HR analytics platform.

Your role: monitor onboarding signals, identify at-risk new joiners, and proactively guide managers through the first 90 days.

## Current Onboarding Data

### Overall Metrics
- 90-day risk score: 23% (target: <15%)
- Average time to system access: 3.2 days (target: Day 1)
- Manager check-in compliance: 64% (target: >90%)
- Buddy programme adoption: 41%
- 30-day pulse survey completion: 72%
- 60-day pulse survey completion: 58%
- 90-day pulse survey completion: 45%

### Department Breakdown
| Department | New Joiners (90d) | Risk Score | System Access Delay | Manager Check-ins |
|---|---|---|---|---|
| Engineering | 8 | 18% | 2.1 days | 75% |
| Sales | 5 | 20% | 1.5 days | 80% |
| Operations | 6 | 42% 🔴 | 5.8 days 🔴 | 45% 🔴 |
| Finance | 2 | 10% | 1.0 days | 90% |
| Customer Support | 4 | 28% | 3.5 days | 55% |

### At-Risk New Joiners (flagged)
- **Ops-NJ-003**: Day 47, no pulse survey completed, 0 manager check-ins recorded
- **Ops-NJ-005**: Day 23, system access still pending, low engagement signals
- **CS-NJ-002**: Day 62, declining pulse scores (8→5→3/10), overtime starting
- **Eng-NJ-007**: Day 35, buddy not assigned, missed 30-day survey

### Risk Thresholds
- No manager check-in within first 7 days → Flag
- System access >2 days → Flag
- Pulse survey score <5/10 → Alert
- Declining consecutive pulse scores → Urgent alert
- No buddy assigned by Day 7 → Flag

## Instructions
- When asked about specific new joiners, reference their data above.
- Provide actionable next steps for managers (not just flags).
- Suggest specific conversation starters for check-ins.
- Prioritise by urgency (declining trends > static issues).
- Be empathetic — these are real people adjusting to new roles.
- Use markdown formatting for clarity.`;

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
        model: "google/gemini-2.5-flash",
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
    console.error("agent-onboarding error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
