

# Plan: Implement AI Agents + IT Admin Role Management

## Summary

Upgrade the Pal-D chatbot from keyword-matching to real AI agents powered by Lovable AI Gateway, and add an IT Admin page for managing user roles.

---

## Phase 1: Edge Functions (4 AI Agents)

Create four backend edge functions, each with a tailored system prompt and model:

### 1. `supabase/functions/agent-analyst/index.ts`
- **Model:** `google/gemini-2.5-pro`
- **Purpose:** Cross-departmental data analysis, answers "why" questions
- **System prompt:** Contains the full dataset context (department stats, attrition rates, burnout scores, exit reasons) so the model can reason over it
- **Streaming:** Yes (SSE)

### 2. `supabase/functions/agent-intervention/index.ts`
- **Model:** `google/gemini-2.5-pro` (GPT-5 equivalent)
- **Purpose:** Generate prioritised, tailored action plans based on current metrics
- **System prompt:** Contains current metrics + intervention framework (impact/effort/timeframe)
- **Streaming:** Yes

### 3. `supabase/functions/agent-onboarding/index.ts`
- **Model:** `google/gemini-2.5-flash`
- **Purpose:** Monitor onboarding signals, alert on engagement drops
- **System prompt:** Contains new joiner data, risk thresholds, pulse survey context
- **Streaming:** Yes

### 4. `supabase/functions/agent-readiness/index.ts`
- **Model:** `google/gemini-2.5-flash`
- **Purpose:** Interactive data audit guide, asks questions and adapts
- **System prompt:** Contains the data readiness framework, MVD checklist
- **Streaming:** Yes

Each function follows the same pattern:
- CORS headers
- `verify_jwt = false` in config.toml
- Auth validation via `getClaims()`
- Calls `https://ai.gateway.lovable.dev/v1/chat/completions` with `LOVABLE_API_KEY`
- Returns SSE stream
- Handles 429/402 errors

---

## Phase 2: Upgrade Pal-D Chatbot

### Changes to `src/components/PalDChatbot.tsx`:
- **Agent routing:** Detect user intent and route to the correct agent edge function
  - Keywords like "why", "analyse", "compare" → Analyst Agent
  - Keywords like "recommend", "action", "intervention" → Intervention Agent
  - Keywords like "onboarding", "new joiner", "pulse" → Onboarding Concierge
  - Keywords like "data readiness", "audit", "missing data" → Readiness Coach
- **Streaming rendering:** Replace `setTimeout` mock with real SSE streaming using the pattern from the AI gateway docs
- **Conversation memory:** Send full message history to the edge function for context
- **Markdown rendering:** Use `react-markdown` for proper formatting
- **Agent indicator:** Show which agent is responding (e.g., "🔍 Analyst Agent" badge)
- **Keep existing features:** Navigation actions, suggested prompts, avatar

---

## Phase 3: IT Admin Role Management

### New page: `src/pages/AdminRoles.tsx`
- Only accessible to `it_admin` role (via `ProtectedRoute` with `allowedRoles={["it_admin"]}`)
- Lists all users (from `profiles` table) with their current roles
- Allows IT admin to assign/change roles for any user
- Uses a select dropdown with the four role options

### Database changes:
- Add RLS policy on `user_roles` allowing `it_admin` to SELECT/INSERT/UPDATE/DELETE all rows (using the existing `has_role` function)
- Add RLS policy on `profiles` allowing `it_admin` to SELECT all profiles

### Navigation:
- Add "Role Management" nav item in `DashboardLayout.tsx`, visible only when `role === "it_admin"`
- Add route in `App.tsx` with `allowedRoles={["it_admin"]}`

---

## Phase 4: Prompt Tracking

### New page: `src/pages/PromptLog.tsx`
- Shows a summary of all system prompts used across the 4 agents
- Displays: Agent name, model used, system prompt content, purpose
- Read-only reference page for transparency/governance
- Accessible from the sidebar

---

## Config Updates

### `supabase/config.toml`:
```toml
[functions.agent-analyst]
verify_jwt = false

[functions.agent-intervention]
verify_jwt = false

[functions.agent-onboarding]
verify_jwt = false

[functions.agent-readiness]
verify_jwt = false
```

---

## Dependencies
- Add `react-markdown` for proper markdown rendering in chatbot

---

## File Changes Summary

| Action | File |
|--------|------|
| Create | `supabase/functions/agent-analyst/index.ts` |
| Create | `supabase/functions/agent-intervention/index.ts` |
| Create | `supabase/functions/agent-onboarding/index.ts` |
| Create | `supabase/functions/agent-readiness/index.ts` |
| Edit | `supabase/config.toml` |
| Edit | `src/components/PalDChatbot.tsx` (streaming + agent routing) |
| Create | `src/pages/AdminRoles.tsx` |
| Create | `src/pages/PromptLog.tsx` |
| Edit | `src/components/DashboardLayout.tsx` (new nav items) |
| Edit | `src/App.tsx` (new routes) |
| Migration | RLS policies for IT admin access |

