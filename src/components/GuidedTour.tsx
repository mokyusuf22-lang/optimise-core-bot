import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play, MapPin, Sparkles, LayoutDashboard, Users, AlertTriangle, Activity, Database, Bot, Shield, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TourStep {
  title: string;
  route: string;
  icon: React.ElementType;
  why: string;
  what: string;
  aiUsed: string | null;
}

const tourSteps: TourStep[] = [
  {
    title: "Overview Dashboard",
    route: "/dashboard",
    icon: LayoutDashboard,
    why: "Senior leaders need a single pane of glass to see the health of the entire organisation at a glance — without drilling into multiple reports. This page answers: \"Where should I focus my attention today?\"",
    what: "Aggregated KPIs across all departments: headcount, attrition risk multipliers, burnout scores, and open roles. Trend charts show whether things are improving or declining over 6 months.",
    aiUsed: null,
  },
  {
    title: "Onboarding Effectiveness",
    route: "/dashboard/onboarding",
    icon: Users,
    why: "35% of new joiners in Operations drop off within 90 days. Onboarding is the single easiest \"beachhead\" use case because it has a defined start, clear milestones, and a measurable end. Fixing onboarding has the highest ROI of any HR intervention.",
    what: "90-day risk scores, system access delays, manager check-in compliance, pulse survey completion rates, and at-risk new joiner flags — all broken down by department.",
    aiUsed: "Onboarding Concierge Agent (Gemini Flash) — monitors pulse survey data and proactively alerts managers when a new joiner's engagement drops. Suggests specific conversation starters for check-ins.",
  },
  {
    title: "Attrition Risk",
    route: "/dashboard/attrition",
    icon: AlertTriangle,
    why: "Sales has a 2.3× baseline attrition risk, with high-performers 2.3× more likely to leave. Losing one experienced salesperson costs 6–9 months of salary in replacement and ramp-up costs. Early detection of flight risk lets HR intervene before resignation.",
    what: "Department-level attrition risk multipliers, exit reason breakdown (compensation 28%, career progression 24%, burnout 22%), high-performer flight risk indicators, and compensation gap analysis.",
    aiUsed: "Diagnostic Analyst Agent (Gemini 2.5 Pro) — answers \"why\" questions like \"Why is attrition high in Sales?\" by cross-referencing compensation data, engagement scores, and exit reasons.",
  },
  {
    title: "Burnout & Capacity",
    route: "/dashboard/burnout",
    icon: Activity,
    why: "Engineering is at a burnout score of 78/100 with 12.3 hrs/week overtime. Teams with >10 hrs/week overtime have 2.1× higher attrition. Burnout is a leading indicator — if you wait until people quit, it's too late. This dashboard lets you catch overload before it becomes attrition.",
    what: "Burnout scores by department, overtime hours, sick day trends, engagement percentages, and the correlation between workload and turnover. Visualises the dangerous feedback loop: understaffing → overtime → burnout → more attrition → more understaffing.",
    aiUsed: "Intervention Recommender Agent (Gemini 2.5 Pro) — generates prioritised action plans with impact/effort/timeframe ratings. Suggests specific interventions like workload redistribution, hiring targets, and manager training.",
  },
  {
    title: "Data Readiness",
    route: "/dashboard/data-readiness",
    icon: Database,
    why: "\"We don't have the data\" is the #1 blocker HR teams cite. But 'no data' almost never means zero data exists — it means data is siloed in spreadsheets, disconnected systems, or email threads. This feature helps organisations discover what they already have and build a practical plan to fill the gaps.",
    what: "The Minimum Viable Data (MVD) checklist across three tiers: Employee Records (usually available), Engagement Signals (often missing), and Performance/Outcome data (advanced). Shows current completeness percentages and recommends the beachhead approach — start with onboarding, not everything at once.",
    aiUsed: "Data Readiness Coach (Gemini Flash) — walks users through data audits interactively, asking one question at a time and adapting guidance based on their answers. Celebrates what you DO have before flagging gaps.",
  },
  {
    title: "AI Prompt Log",
    route: "/dashboard/prompt-log",
    icon: BookOpen,
    why: "AI governance and transparency. When AI makes recommendations that affect people's careers, you need to know exactly what prompts and models are being used. This page exists for auditability — so leadership can review, challenge, and approve the AI's operating parameters.",
    what: "Full system prompts for all 4 AI agents, the models they use (Gemini 2.5 Pro vs Flash), their purposes, and the data context they operate on. This is your AI governance layer.",
    aiUsed: "This page documents all 4 agents: Diagnostic Analyst (Pro), Intervention Recommender (Pro), Onboarding Concierge (Flash), and Data Readiness Coach (Flash).",
  },
  {
    title: "Pal-D AI Assistant",
    route: "/dashboard",
    icon: Bot,
    why: "Dashboards show you what's happening. But dashboards can't answer follow-up questions like \"Why is Engineering burning out more than last quarter?\" or \"What should I do about the Sales attrition spike?\". Pal-D bridges the gap between data visibility and actionable insight — it's the interface between static dashboards and dynamic AI reasoning.",
    what: "A floating chatbot that routes your question to the right specialist AI agent based on intent: analysis questions → Analyst Agent, action planning → Intervention Agent, onboarding concerns → Onboarding Concierge, data gaps → Readiness Coach. Supports streaming responses, conversation memory, and markdown formatting.",
    aiUsed: "All 4 agents are accessible through Pal-D. The routing is intent-based using keyword detection. Each agent has a tailored system prompt with the full organisational dataset embedded.",
  },
  {
    title: "Role Management",
    route: "/dashboard/admin-roles",
    icon: Shield,
    why: "Different roles need different views and different access levels. A senior leader shouldn't see the same dense operational data a manager needs. An IT admin needs to control who sees what. Role-based access ensures data security and reduces cognitive overload by showing each person only what's relevant to them.",
    what: "IT admins can assign roles (Manager, HR, IT Admin, Senior Leader) to any user. Roles determine dashboard view defaults, navigation access, and which AI agent suggestions appear. Protected by row-level security policies.",
    aiUsed: null,
  },
];

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuidedTour = ({ isOpen, onClose }: GuidedTourProps) => {
  const [currentStep, setCurrentStep] = useState(-1); // -1 = intro screen
  const navigate = useNavigate();
  const location = useLocation();

  const goToStep = useCallback((idx: number) => {
    setCurrentStep(idx);
    if (idx >= 0 && idx < tourSteps.length) {
      navigate(tourSteps[idx].route);
    }
  }, [navigate]);

  const next = () => {
    if (currentStep < tourSteps.length - 1) goToStep(currentStep + 1);
    else { onClose(); setCurrentStep(-1); }
  };

  const prev = () => {
    if (currentStep > 0) goToStep(currentStep - 1);
    else setCurrentStep(-1);
  };

  const handleClose = () => {
    setCurrentStep(-1);
    onClose();
  };

  const step = currentStep >= 0 ? tourSteps[currentStep] : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-24 right-6 z-[60] w-[420px] max-h-[70vh] rounded-2xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                {currentStep === -1 ? "Platform Tour" : `Step ${currentStep + 1} of ${tourSteps.length}`}
              </span>
            </div>
            <button onClick={handleClose} className="p-1 rounded-md hover:bg-muted transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5">
            <AnimatePresence mode="wait">
              {currentStep === -1 ? (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">Welcome to Mission Control</h3>
                      <p className="text-xs text-muted-foreground">Your guided walkthrough of every feature</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                    This tour walks you through each feature, explains <strong className="text-foreground">why it exists</strong>, what it shows, and where AI agents are used. You'll be navigated to each page automatically.
                  </p>

                  <div className="space-y-1.5 mb-5">
                    {tourSteps.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => goToStep(i)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-muted/60 transition-colors group"
                      >
                        <s.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">{s.title}</span>
                        {s.aiUsed && <Bot className="h-3 w-3 text-primary/60 ml-auto" />}
                      </button>
                    ))}
                  </div>

                  <Button onClick={() => goToStep(0)} className="w-full gap-2">
                    <Play className="h-4 w-4" />
                    Start Tour
                  </Button>
                </motion.div>
              ) : step && (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <step.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">{step.title}</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">Why This Exists</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.why}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-1.5">What It Shows</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.what}</p>
                    </div>

                    {step.aiUsed && (
                      <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Bot className="h-3.5 w-3.5 text-primary" />
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">AI Agent Used</h4>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{step.aiUsed}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer nav */}
          {currentStep >= 0 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/20">
              <Button variant="ghost" size="sm" onClick={prev} className="gap-1.5">
                <ChevronLeft className="h-3.5 w-3.5" />
                {currentStep === 0 ? "Menu" : "Back"}
              </Button>

              {/* Progress dots */}
              <div className="flex gap-1">
                {tourSteps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToStep(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === currentStep ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    )}
                  />
                ))}
              </div>

              <Button variant="ghost" size="sm" onClick={next} className="gap-1.5">
                {currentStep === tourSteps.length - 1 ? "Finish" : "Next"}
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GuidedTour;
