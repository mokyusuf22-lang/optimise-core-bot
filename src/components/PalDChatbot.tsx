import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import palDAvatar from "@/assets/pal-d-avatar.jpg";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  actions?: { label: string; route: string }[];
}

const systemKnowledge = {
  navigation: {
    "/dashboard": "Overview — KPI summary of onboarding, attrition, burnout, and retention.",
    "/dashboard/onboarding": "Onboarding — First-90-day risk scores, new joiner monitoring, access & engagement metrics.",
    "/dashboard/attrition": "Attrition Risk — Hotspot analysis, predicted leavers, retention strategy options.",
    "/dashboard/burnout": "Burnout & Capacity — Team burnout scores, overtime/sick leave trends, well-being indicators.",
  },
  recommendations: {
    burnout: [
      { title: "Redistribute Workload", desc: "Shift 15–20% of tasks from Engineering to less-loaded teams. Impact: High. Effort: Medium. Timeframe: 2 weeks." },
      { title: "Hire Contract Support", desc: "Bring in 2–3 contractors for the quarter. Impact: High. Effort: High. Timeframe: 4–6 weeks." },
      { title: "Enforce PTO Policy", desc: "Mandate minimum 1 day off per fortnight for high-overtime teams. Impact: Medium. Effort: Low. Timeframe: Immediate." },
    ],
    attrition: [
      { title: "Compensation Review", desc: "Benchmark Sales high-performers against market. Close the gap to reduce 2.3x attrition risk. Impact: High. Effort: Medium." },
      { title: "Career Path Framework", desc: "Introduce visible promotion tracks for Engineering mid-levels. Impact: High. Effort: Medium. Timeframe: 6–8 weeks." },
      { title: "Stay Interviews", desc: "Conduct 1:1 retention conversations with the 40 high-risk employees. Impact: Medium. Effort: Low. Timeframe: 2 weeks." },
    ],
    onboarding: [
      { title: "Pre-Provisioning Access", desc: "Set up system access before Day 1 to eliminate the 30% delay driver. Impact: High. Effort: Medium. Timeframe: 3 weeks." },
      { title: "Buddy Programme", desc: "Pair every new joiner with a tenured team member for the first 30 days. Impact: Medium. Effort: Low. Timeframe: 1 week." },
      { title: "Manager Check-In Cadence", desc: "Mandate weekly 15-min check-ins during the first 90 days. Impact: High. Effort: Low. Timeframe: Immediate." },
    ],
  },
};

function generateResponse(input: string, currentPath: string): Message {
  const lower = input.toLowerCase();
  const id = Date.now().toString();

  // Navigation help
  if (lower.includes("navigate") || lower.includes("go to") || lower.includes("show me") || lower.includes("where")) {
    return {
      id, role: "assistant",
      content: "Here are the areas you can explore in Mission Control:",
      actions: [
        { label: "📊 Overview", route: "/dashboard" },
        { label: "👥 Onboarding", route: "/dashboard/onboarding" },
        { label: "⚠️ Attrition Risk", route: "/dashboard/attrition" },
        { label: "🔥 Burnout & Capacity", route: "/dashboard/burnout" },
      ],
    };
  }

  // Recommendations
  if (lower.includes("recommend") || lower.includes("suggestion") || lower.includes("what should") || lower.includes("what can") || lower.includes("options") || lower.includes("intervention")) {
    let area: "burnout" | "attrition" | "onboarding" = "burnout";
    if (lower.includes("attrition") || lower.includes("retention") || lower.includes("leav")) area = "attrition";
    else if (lower.includes("onboard") || lower.includes("new joiner") || lower.includes("new hire")) area = "onboarding";
    else if (currentPath.includes("attrition")) area = "attrition";
    else if (currentPath.includes("onboarding")) area = "onboarding";

    const recs = systemKnowledge.recommendations[area];
    const content = `**${area.charAt(0).toUpperCase() + area.slice(1)} Recommendations:**\n\n${recs.map((r, i) => `**${i + 1}. ${r.title}**\n${r.desc}`).join("\n\n")}`;
    return { id, role: "assistant", content };
  }

  // Current page context
  if (lower.includes("what") && (lower.includes("this") || lower.includes("page") || lower.includes("here"))) {
    const desc = systemKnowledge.navigation[currentPath as keyof typeof systemKnowledge.navigation] || "You're viewing the Mission Control platform.";
    return { id, role: "assistant", content: `You're currently on: **${desc}**\n\nWould you like recommendations for this area, or would you like to navigate somewhere else?` };
  }

  // Burnout specific
  if (lower.includes("burnout") || lower.includes("overtime") || lower.includes("capacity")) {
    const recs = systemKnowledge.recommendations.burnout;
    return { id, role: "assistant", content: `**Burnout Risk Analysis:**\n\nEngineering is the highest-risk team with a burnout score of 78/100. Here are my recommendations:\n\n${recs.map((r, i) => `**${i + 1}. ${r.title}** — ${r.desc}`).join("\n\n")}`,
      actions: [{ label: "View Burnout Dashboard", route: "/dashboard/burnout" }],
    };
  }

  // Attrition
  if (lower.includes("attrition") || lower.includes("leav") || lower.includes("quit") || lower.includes("retention")) {
    const recs = systemKnowledge.recommendations.attrition;
    return { id, role: "assistant", content: `**Attrition Risk Summary:**\n\n18% overall risk. Sales high-performers are 2.3x more likely to leave. Here are intervention options:\n\n${recs.map((r, i) => `**${i + 1}. ${r.title}** — ${r.desc}`).join("\n\n")}`,
      actions: [{ label: "View Attrition Dashboard", route: "/dashboard/attrition" }],
    };
  }

  // Onboarding
  if (lower.includes("onboard") || lower.includes("new hire") || lower.includes("new joiner")) {
    const recs = systemKnowledge.recommendations.onboarding;
    return { id, role: "assistant", content: `**Onboarding Effectiveness:**\n\n23% risk score overall. Ops department has 35% higher drop-off. Recommendations:\n\n${recs.map((r, i) => `**${i + 1}. ${r.title}** — ${r.desc}`).join("\n\n")}`,
      actions: [{ label: "View Onboarding Dashboard", route: "/dashboard/onboarding" }],
    };
  }

  // Default
  return {
    id, role: "assistant",
    content: "I'm **Pal-D**, your diagnostic AI assistant. I can help you:\n\n• **Navigate** the platform — just ask me to show you a section\n• **Get recommendations** for burnout, attrition, or onboarding risks\n• **Explain** what you're looking at on any page\n\nTry asking: *\"What are my options for reducing attrition?\"*",
  };
}

const PalDChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: "Hey! I'm **Pal-D** 👋 Your AI diagnostic assistant.\n\nI can help you navigate the platform, explore insights, and get actionable recommendations. What would you like to know?" },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const response = generateResponse(input, location.pathname);
      setMessages((prev) => [...prev, response]);
    }, 400);
  }, [input, location.pathname]);

  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg overflow-hidden border-2 border-primary/30 hover:border-primary transition-colors"
          >
            <img src={palDAvatar} alt="Pal-D Assistant" className="h-full w-full object-cover" />
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-accent border-2 border-background" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] rounded-2xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground">
              <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-primary-foreground/30 shrink-0">
                <img src={palDAvatar} alt="Pal-D" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold">Pal-D</p>
                <p className="text-[10px] opacity-80">Diagnostic AI Assistant</p>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 opacity-60" />
                <span className="text-[10px] opacity-60">Live</span>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/10" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}>
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                    {msg.actions && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {msg.actions.map((action) => (
                          <button
                            key={action.route}
                            onClick={() => { navigate(action.route); setIsOpen(false); }}
                            className="text-xs px-2.5 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Pal-D anything..."
                  className="flex-1 text-sm px-3 py-2 rounded-lg bg-muted border border-input focus:outline-none focus:ring-1 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                />
                <Button type="submit" size="icon" className="h-9 w-9 shrink-0" disabled={!input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <div className="flex gap-1.5 mt-2 overflow-x-auto">
                {["Recommendations", "Navigate", "What's this page?"].map((q) => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); }}
                    className="text-[10px] px-2 py-1 rounded-md bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors whitespace-nowrap"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PalDChatbot;
