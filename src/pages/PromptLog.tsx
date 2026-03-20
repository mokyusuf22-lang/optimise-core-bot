import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Brain, HeartPulse, Database, BookOpen } from "lucide-react";

const agents = [
  {
    name: "Diagnostic Analyst",
    icon: Brain,
    model: "google/gemini-2.5-pro",
    purpose: "Cross-departmental data analysis. Answers 'why' questions by reasoning over workforce metrics.",
    edgeFunction: "agent-analyst",
    promptSummary: [
      "Contains full department metrics table (headcount, attrition risk, burnout scores, overtime, sick days, engagement, open roles)",
      "Top 5 exit reasons with percentages",
      "Onboarding metrics and key correlations",
      "Instructions: ground answers in data, cite specific numbers, use tables for comparisons, flag when data is missing",
    ],
  },
  {
    name: "Intervention Recommender",
    icon: HeartPulse,
    model: "google/gemini-2.5-pro",
    purpose: "Generates tailored, prioritised action plans based on current metrics rather than static recommendations.",
    edgeFunction: "agent-intervention",
    promptSummary: [
      "Critical areas with specific metrics (Engineering burnout 78/100, Sales 2.3× attrition, Operations onboarding 35% drop-off)",
      "Organisation-wide exit reasons",
      "Intervention framework template: Action, Impact, Effort, Timeframe, Owner, Success Metric",
      "Instructions: prioritise by impact-to-effort ratio, provide 3–5 recommendations per area, consider second-order effects",
    ],
  },
  {
    name: "Onboarding Concierge",
    icon: Bot,
    model: "google/gemini-2.5-flash",
    purpose: "Monitors onboarding signals and proactively alerts managers when new joiner engagement drops.",
    edgeFunction: "agent-onboarding",
    promptSummary: [
      "Overall onboarding metrics (risk score, access delay, check-in compliance, pulse survey completion rates)",
      "Department breakdown with new joiner counts and risk scores",
      "4 flagged at-risk new joiners with specific signals",
      "Risk thresholds: no check-in within 7 days, access >2 days, pulse <5/10, declining scores",
      "Instructions: actionable next steps for managers, conversation starters, prioritise by urgency, be empathetic",
    ],
  },
  {
    name: "Data Readiness Coach",
    icon: Database,
    model: "google/gemini-2.5-flash",
    purpose: "Walks users through data audits interactively, asking questions and adapting guidance based on answers.",
    edgeFunction: "agent-readiness",
    promptSummary: [
      "'No Data' myth framework — data is usually siloed, not absent",
      "Beachhead strategy: pick ONE use case first (recommends Onboarding)",
      "Minimum Viable Data checklist across 3 tiers with sources",
      "Current platform data readiness matrix with status and completeness",
      "Instructions: ask ONE question at a time, celebrate existing data, provide specific practical next steps",
    ],
  },
];

const PromptLog = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          AI Agent Prompt Log
        </h1>
        <p className="text-muted-foreground mt-1">Transparency view of all AI system prompts, models, and agent purposes used in Pal-D.</p>
      </div>

      <div className="grid gap-4">
        {agents.map((agent) => (
          <Card key={agent.edgeFunction}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <agent.icon className="h-5 w-5 text-primary" />
                  {agent.name}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline" className="font-mono text-xs">{agent.model}</Badge>
                  <Badge variant="secondary" className="font-mono text-xs">{agent.edgeFunction}</Badge>
                </div>
              </div>
              <CardDescription>{agent.purpose}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs font-medium text-muted-foreground mb-2">System Prompt Contents:</p>
              <ScrollArea className="max-h-48">
                <ul className="space-y-1.5">
                  {agent.promptSummary.map((item, i) => (
                    <li key={i} className="text-sm text-foreground/80 flex gap-2">
                      <span className="text-primary/60 shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <strong>Total agents:</strong> 4 &nbsp;|&nbsp; <strong>Models used:</strong> Gemini 2.5 Pro (2 agents), Gemini 2.5 Flash (2 agents) &nbsp;|&nbsp; <strong>Streaming:</strong> All agents use SSE streaming for real-time responses.
          </p>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default PromptLog;
