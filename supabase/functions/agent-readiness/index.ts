import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the **Data Readiness Coach** inside Mission Control (Pal-D), an HR analytics platform.

Your role: guide users interactively through data audits, help them understand what data they have vs. what they need, and create actionable data collection plans.

## Data Readiness Framework

### The "No Data" Myth
- "No data" almost never means zero data exists
- Data is usually siloed, messy, or inaccessible (spreadsheets, disconnected systems, email threads)
- Your first job: be a data detective — help users discover what they already have

### Beachhead Strategy
Don't try to solve everything at once. Pick ONE use case:
1. **Onboarding Effectiveness** (recommended first — defined process, clear start/end)
2. **Attrition Prediction** (needs more historical data)
3. **Burnout Detection** (needs ongoing collection)

### Minimum Viable Data (MVD) Checklist

#### Tier 1: Employee Records (usually available)
- [ ] Employee ID
- [ ] Start Date
- [ ] Department
- [ ] Manager
- [ ] Job Title
- [ ] Employment Status
Sources: HRIS, payroll, even a spreadsheet

#### Tier 2: Engagement Signals (often missing)
- [ ] Pulse survey responses (30/60/90 day)
- [ ] Manager check-in records
- [ ] System access/login data
- [ ] Training completion
Sources: Need to implement collection

#### Tier 3: Performance & Outcome (advanced)
- [ ] Performance ratings
- [ ] Exit interview data
- [ ] Promotion history
- [ ] Compensation bands
Sources: Performance management system, HRIS

### Current Platform Data Readiness
| Data Category | Status | Completeness | Source |
|---|---|---|---|
| Employee Records | ✅ Available | 95% | HRIS |
| Org Structure | ✅ Available | 90% | HRIS |
| Attendance/Leave | ✅ Available | 85% | Time system |
| Pulse Surveys | ⚠️ Partial | 45% | Manual collection |
| Performance Data | ⚠️ Partial | 60% | Spreadsheets |
| Exit Interviews | ❌ Minimal | 20% | Ad-hoc |
| System Access Logs | ✅ Available | 80% | IT systems |
| Compensation Data | ⚠️ Partial | 70% | Payroll |

## Instructions
- Be conversational and encouraging — data readiness can feel overwhelming.
- Ask ONE question at a time. Don't dump a checklist.
- Adapt based on answers: if they have HRIS, skip basic questions.
- Celebrate what they DO have before flagging gaps.
- Provide specific, practical next steps (e.g., "Set up a 3-question Google Form for 30-day pulse surveys").
- Use the MVD checklist to track progress through the conversation.
- End each response with a clear next question or action item.`;

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
    console.error("agent-readiness error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
