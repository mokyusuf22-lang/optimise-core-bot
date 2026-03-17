import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import {
  Search, Target, Database, ClipboardCheck, AlertTriangle,
  CheckCircle2, XCircle, HelpCircle, FileSpreadsheet, Mail,
  Building2, UserCheck, CalendarClock, BarChart3
} from "lucide-react";

/* ── Phase definitions ────────────────────────────────────── */
const phases = [
  {
    id: "audit",
    icon: Search,
    title: "Validate the 'No Data' Claim",
    subtitle: "Be a data detective — 'no data' is rare",
    badge: "Phase 1",
    colour: "primary",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Organisations almost always have more data than they think. The real problem is that data is <strong className="text-foreground">siloed, messy, or inaccessible</strong> — buried in spreadsheets, disconnected systems, or tribal knowledge.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: "HRIS / Payroll", status: "likely", note: "Employee records, start dates, titles" },
            { label: "Email / Calendar", status: "likely", note: "Meeting cadence, manager 1:1s" },
            { label: "IT Ticketing / Access Logs", status: "likely", note: "System provision timelines" },
            { label: "LMS / Training Platform", status: "partial", note: "Completion rates, enrolment" },
            { label: "Engagement Surveys", status: "missing", note: "Pulse data, sentiment scores" },
            { label: "Exit Interview Records", status: "partial", note: "Often unstructured / ad-hoc" },
          ].map((src) => (
            <div key={src.label} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              {src.status === "likely" && <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />}
              {src.status === "partial" && <HelpCircle className="h-4 w-4 text-warning mt-0.5 shrink-0" />}
              {src.status === "missing" && <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />}
              <div>
                <p className="text-sm font-medium text-foreground">{src.label}</p>
                <p className="text-xs text-muted-foreground">{src.note}</p>
              </div>
            </div>
          ))}
        </div>
        <Card className="border-accent/30 bg-accent/5">
          <CardContent className="py-3">
            <p className="text-sm"><span className="font-bold">Pal-D Tip:</span> Start with a <strong>data asset map</strong> — list every system that touches the employee lifecycle. You'll almost always find 60–80% of what you need already exists.</p>
          </CardContent>
        </Card>
      </div>
    ),
  },
  {
    id: "beachhead",
    icon: Target,
    title: "Select a 'Beachhead' Use Case",
    subtitle: "Don't boil the ocean — pick one winnable battle",
    badge: "Phase 2",
    colour: "primary",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Resist the urge to tackle all three MVP use cases simultaneously. Pick the one with the <strong className="text-foreground">lowest data friction</strong> and <strong className="text-foreground">clearest measurable outcome</strong>.
        </p>
        <div className="space-y-3">
          {[
            {
              name: "Onboarding Effectiveness",
              score: 85,
              recommended: true,
              reason: "Defined process with clear start/end. Most data already in HRIS + IT systems.",
            },
            {
              name: "Attrition Prediction",
              score: 55,
              recommended: false,
              reason: "Requires historical exit data + engagement signals. Often needs 12+ months of history.",
            },
            {
              name: "Burnout & Capacity",
              score: 40,
              recommended: false,
              reason: "Hardest to measure — needs overtime, wellbeing, and workload data across systems.",
            },
          ].map((uc) => (
            <div key={uc.name} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-foreground">{uc.name}</p>
                  {uc.recommended && <Badge className="text-[10px]">Recommended</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{uc.reason}</p>
              </div>
              <div className="text-right shrink-0 w-20">
                <p className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>{uc.score}%</p>
                <p className="text-[10px] text-muted-foreground">Data Ready</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "mvd",
    icon: Database,
    title: "Define Minimum Viable Data (MVD)",
    subtitle: "For the Onboarding Effectiveness use case",
    badge: "Phase 3",
    colour: "primary",
    content: (
      <div className="space-y-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          What is the <strong className="text-foreground">absolute bare minimum</strong> data needed to generate actionable onboarding insights?
        </p>

        {/* MVD Category 1 — Employee Records */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">Employee Records</CardTitle>
              <Badge variant="outline" className="ml-auto text-[10px]">Usually available</Badge>
            </div>
            <CardDescription className="text-xs">Source: HRIS or Payroll system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {["Employee ID", "Start Date", "Department", "Manager", "Job Title", "Location"].map((field) => (
                <div key={field} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span>{field}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              <strong>Reality check:</strong> Does a basic HRIS or even a payroll system exist? If yes, this data is already captured. Even a shared spreadsheet counts.
            </p>
          </CardContent>
        </Card>

        {/* MVD Category 2 — Process Milestones */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">Onboarding Process Milestones</CardTitle>
              <Badge variant="secondary" className="ml-auto text-[10px]">Partially available</Badge>
            </div>
            <CardDescription className="text-xs">Source: IT tickets, LMS, calendar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                "System Access Date",
                "Laptop Provision Date",
                "Training Completion %",
                "First Manager 1:1 Date",
                "Buddy Assigned (Y/N)",
                "Probation Outcome",
              ].map((field) => (
                <div key={field} className="flex items-center gap-2 text-sm">
                  <HelpCircle className="h-3.5 w-3.5 text-warning shrink-0" />
                  <span>{field}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Most of these can be reconstructed from IT ticket timestamps and calendar data. The key metric is <strong>days from start date to full system access</strong>.
            </p>
          </CardContent>
        </Card>

        {/* MVD Category 3 — Engagement / Sentiment */}
        <Card className="border-destructive/30">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-destructive" />
              <CardTitle className="text-sm">Performance / Engagement Signal</CardTitle>
              <Badge variant="destructive" className="ml-auto text-[10px]">Likely missing</Badge>
            </div>
            <CardDescription className="text-xs">This is the gap Pal-D helps you close</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              This is almost always the missing piece. Without it, you're blind to <strong className="text-foreground">how new joiners actually feel</strong>.
            </p>
            <Card className="bg-accent/5 border-accent/30">
              <CardContent className="py-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-accent" />
                  <p className="text-sm font-medium text-foreground">Proposed Solution: 30-60-90 Day Pulse Survey</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Implement a simple, standardised 5-question pulse survey sent via email (or a free tool like Google Forms / Microsoft Forms) at the <strong>30, 60, and 90-day marks</strong> for every new hire. Takes &lt;2 minutes to complete.
                </p>
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-medium text-foreground">Suggested questions:</p>
                  {[
                    "I have the tools and access I need to do my job effectively. (1–5)",
                    "My manager has had meaningful check-ins with me. (1–5)",
                    "I understand what is expected of me in my role. (1–5)",
                    "I feel welcomed and supported by my team. (1–5)",
                    "How likely are you to recommend this company to a friend? (0–10 NPS)",
                  ].map((q, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground shrink-0">{i + 1}.</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    ),
  },
];

/* ── MVD Completeness Tracker ─────────────────────────────── */
const mvdChecklist = [
  { category: "Employee Records", items: 6, available: 6, pct: 100 },
  { category: "Process Milestones", items: 6, available: 3, pct: 50 },
  { category: "Engagement Signal", items: 5, available: 0, pct: 0 },
];

const totalPct = Math.round(mvdChecklist.reduce((s, c) => s + c.pct, 0) / mvdChecklist.length);

/* ── Page Component ───────────────────────────────────────── */
const DataReadiness = () => {
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            Data Readiness Playbook
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            A step-by-step framework to go from "we have no data" to actionable workforce intelligence.
          </p>
        </div>

        {/* Overall readiness gauge */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              MVD Completeness Tracker
            </CardTitle>
            <CardDescription>Minimum Viable Data readiness for the Onboarding use case</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-3xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>{totalPct}%</div>
              <Progress value={totalPct} className="flex-1 h-3" />
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {mvdChecklist.map((cat) => (
                <div key={cat.category} className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-foreground">{cat.category}</p>
                    <Badge variant={cat.pct === 100 ? "default" : cat.pct > 0 ? "secondary" : "destructive"} className="text-[10px]">
                      {cat.available}/{cat.items}
                    </Badge>
                  </div>
                  <Progress value={cat.pct} className="h-1.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Phases */}
        <div className="space-y-4">
          {phases.map((phase, i) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
            >
              <Card>
                <Accordion type="single" collapsible defaultValue={i === 0 ? phase.id : undefined}>
                  <AccordionItem value={phase.id} className="border-none">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <phase.icon className="h-4.5 w-4.5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px]">{phase.badge}</Badge>
                            <h3 className="text-sm font-semibold text-foreground">{phase.title}</h3>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{phase.subtitle}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-5">
                      {phase.content}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Insight banner */}
        <Card className="mt-6 border-accent/30 bg-accent/5">
          <CardContent className="py-4">
            <p className="text-sm">
              <span className="font-bold">Pal-D Recommendation:</span> You're at <strong>{totalPct}% data readiness</strong> for the Onboarding use case. The critical gap is engagement signal data. Deploying a 30-60-90 day pulse survey would move you to ~83% readiness within one quarter — enough to generate meaningful risk scores.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default DataReadiness;
