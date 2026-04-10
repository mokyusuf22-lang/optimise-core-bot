# Optimise Core Bot — AI-Enabled Live Service Design

An AI-powered people analytics dashboard built with React, TypeScript, Supabase, and Vite. Provides real-time workforce insights, AI-driven recommendations, and role-based access control for HR and operations teams.

## Features

- **Pal-D AI Chatbot** — Intelligent chat interface with four specialised agents:
  - Analyst Agent — cross-departmental data analysis and trend explanations
  - Intervention Agent — prioritised action plan generation
  - Onboarding Concierge — new joiner engagement monitoring and alerts
  - Readiness Coach — interactive data audit guidance
- **People Analytics Dashboard** — Attrition, burnout, engagement, and onboarding metrics
- **Role-Based Access Control** — HR Lead, Line Manager, Executive, IT Admin roles
- **IT Admin Panel** — User role management interface
- **Prompt Log** — Governance view of all AI agent system prompts

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui, Radix UI |
| Backend | Supabase (PostgreSQL + Edge Functions) |
| AI | Google Gemini 2.5 Pro / Flash via AI Gateway |
| Auth | Supabase Auth with row-level security |
| Testing | Vitest, Playwright |

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Supabase project with the required schema and edge functions deployed

### Install dependencies

```bash
npm install
# or
bun install
```

### Environment variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run locally

```bash
npm run dev
```

The app will be available at `http://localhost:8080`.

### Build for production

```bash
npm run build
```

### Run tests

```bash
# Unit tests
npm run test

# E2E tests (Playwright)
npx playwright test
```

## Project Structure

```
src/
  components/       # Reusable UI components
  pages/            # Route-level page components
  hooks/            # Custom React hooks
  lib/              # Utility functions and Supabase client
supabase/
  functions/        # Edge Functions (AI agents)
  migrations/       # Database migrations
```

## Roles

| Role | Access |
|------|--------|
| `hr_lead` | Full dashboard, all analytics, chatbot |
| `line_manager` | Team-level metrics, chatbot |
| `executive` | Executive summary view |
| `it_admin` | Role management panel |

## License

Private — internal use only.
