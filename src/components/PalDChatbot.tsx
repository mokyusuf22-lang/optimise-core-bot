import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, Loader2, Brain, HeartPulse, Bot, Database, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import palDAvatar from "@/assets/pal-d-avatar.jpg";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  agent?: string;
  actions?: { label: string; route: string }[];
}

type AgentType = "analyst" | "intervention" | "onboarding" | "readiness" | "navigator";

const agentMeta: Record<AgentType, { label: string; icon: typeof Brain; color: string; fn: string }> = {
  analyst: { label: "Analyst", icon: Brain, color: "text-blue-500", fn: "agent-analyst" },
  intervention: { label: "Advisor", icon: HeartPulse, color: "text-rose-500", fn: "agent-intervention" },
  onboarding: { label: "Concierge", icon: Bot, color: "text-emerald-500", fn: "agent-onboarding" },
  readiness: { label: "Coach", icon: Database, color: "text-amber-500", fn: "agent-readiness" },
  navigator: { label: "Navigator", icon: Compass, color: "text-primary", fn: "" },
};

const suggestedPromptsByRoute: Record<string, string[]> = {
  "/dashboard": [
    "Which area needs attention first?",
    "Show me key risks across all teams",
    "What are the top 3 priorities this quarter?",
  ],
  "/dashboard/onboarding": [
    "Which new joiners are most at risk?",
    "How do I reduce onboarding drop-off?",
    "What's driving low manager engagement?",
  ],
  "/dashboard/attrition": [
    "Why are Sales high-performers leaving?",
    "What retention strategies should I use?",
    "Compare attrition risk across departments",
  ],
  "/dashboard/burnout": [
    "What's causing Engineering burnout?",
    "How can I reduce overtime immediately?",
    "Recommend interventions for at-risk teams",
  ],
  "/dashboard/data-readiness": [
    "Walk me through a data audit",
    "What data do I actually need?",
    "Help me assess my data readiness",
  ],
};

function detectAgent(input: string, currentPath: string): AgentType {
  const lower = input.toLowerCase();
  if (lower.includes("navigate") || lower.includes("go to") || lower.includes("where") || lower.includes("show me") && lower.includes("page")) return "navigator";
  if (lower.includes("data readiness") || lower.includes("audit") || lower.includes("missing data") || lower.includes("what data") || currentPath.includes("data-readiness") && (lower.includes("help") || lower.includes("walk"))) return "readiness";
  if (lower.includes("onboard") || lower.includes("new joiner") || lower.includes("new hire") || lower.includes("pulse") || lower.includes("buddy") || currentPath.includes("onboarding") && (lower.includes("risk") || lower.includes("who"))) return "onboarding";
  if (lower.includes("recommend") || lower.includes("action") || lower.includes("intervention") || lower.includes("what should") || lower.includes("what can") || lower.includes("how can") || lower.includes("how do") || lower.includes("strategy") || lower.includes("plan")) return "intervention";
  if (lower.includes("why") || lower.includes("analy") || lower.includes("compare") || lower.includes("trend") || lower.includes("cause") || lower.includes("correlation") || lower.includes("across")) return "analyst";
  // Default based on route
  if (currentPath.includes("burnout") || currentPath.includes("attrition")) return "analyst";
  return "analyst";
}

const CHAT_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

async function streamFromAgent(
  agentFn: string,
  messages: { role: string; content: string }[],
  onDelta: (text: string) => void,
  onDone: () => void,
  onError: (err: string) => void,
) {
  const resp = await fetch(`${CHAT_BASE}/${agentFn}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok) {
    const data = await resp.json().catch(() => ({ error: "Request failed" }));
    onError(data.error || `Error ${resp.status}`);
    return;
  }

  if (!resp.body) { onError("No response body"); return; }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let nlIdx: number;
    while ((nlIdx = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, nlIdx);
      buffer = buffer.slice(nlIdx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") { onDone(); return; }
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }
  onDone();
}

const PalDChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: "Hey! I'm **Pal-D** 👋 Your AI diagnostic assistant.\n\nI can connect you to specialised AI agents for analysis, recommendations, onboarding monitoring, and data readiness coaching. Try the prompts above or ask me anything!", agent: "navigator" },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || isStreaming) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const agent = detectAgent(msg, location.pathname);
    const meta = agentMeta[agent];

    // Navigator handles locally
    if (agent === "navigator") {
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          agent: "navigator",
          content: "Here are the areas you can explore:",
          actions: [
            { label: "📊 Overview", route: "/dashboard" },
            { label: "👥 Onboarding", route: "/dashboard/onboarding" },
            { label: "⚠️ Attrition Risk", route: "/dashboard/attrition" },
            { label: "🔥 Burnout & Capacity", route: "/dashboard/burnout" },
            { label: "📋 Data Readiness", route: "/dashboard/data-readiness" },
          ],
        }]);
      }, 200);
      return;
    }

    // Stream from AI agent
    setIsStreaming(true);
    const assistantId = (Date.now() + 1).toString();
    let accumulated = "";

    // Build conversation history for context
    const history = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-10)
      .map((m) => ({ role: m.role, content: m.content }));
    history.push({ role: "user", content: msg });

    // Add placeholder
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "", agent }]);

    await streamFromAgent(
      meta.fn,
      history,
      (delta) => {
        accumulated += delta;
        setMessages((prev) =>
          prev.map((m) => m.id === assistantId ? { ...m, content: accumulated } : m)
        );
      },
      () => setIsStreaming(false),
      (err) => {
        setMessages((prev) =>
          prev.map((m) => m.id === assistantId ? { ...m, content: `⚠️ ${err}` } : m)
        );
        setIsStreaming(false);
      },
    );
  }, [input, location.pathname, isStreaming, messages]);

  const suggestedPrompts = suggestedPromptsByRoute[location.pathname] || suggestedPromptsByRoute["/dashboard"];

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg overflow-hidden border-2 border-primary/30 hover:border-primary transition-colors"
          >
            <img src={palDAvatar} alt="Pal-D Assistant" className="h-full w-full object-cover" />
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-accent border-2 border-background" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] h-[560px] rounded-2xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground">
              <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-primary-foreground/30 shrink-0">
                <img src={palDAvatar} alt="Pal-D" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold">Pal-D</p>
                <p className="text-[10px] opacity-80">AI-Powered • 4 Specialist Agents</p>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 opacity-60" />
                <span className="text-[10px] opacity-60">Live</span>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/10" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Suggested prompts */}
            <div className="px-3 py-2 border-b border-border bg-muted/30">
              <p className="text-[10px] text-muted-foreground mb-1.5 font-medium">Suggested</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    disabled={isStreaming}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-card border border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
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
                    {msg.agent && msg.role === "assistant" && (
                      <AgentBadge agent={msg.agent as AgentType} />
                    )}
                    <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-headings:my-2 prose-li:my-0.5 prose-table:text-xs">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                    {msg.role === "assistant" && !msg.content && isStreaming && (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    )}
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
                  disabled={isStreaming}
                  className="flex-1 text-sm px-3 py-2 rounded-lg bg-muted border border-input focus:outline-none focus:ring-1 focus:ring-ring text-foreground placeholder:text-muted-foreground disabled:opacity-50"
                />
                <Button type="submit" size="icon" className="h-9 w-9 shrink-0" disabled={!input.trim() || isStreaming}>
                  {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

function AgentBadge({ agent }: { agent: AgentType }) {
  const meta = agentMeta[agent];
  if (!meta) return null;
  const Icon = meta.icon;
  return (
    <div className={`flex items-center gap-1 mb-1.5 ${meta.color}`}>
      <Icon className="h-3 w-3" />
      <span className="text-[10px] font-semibold">{meta.label} Agent</span>
    </div>
  );
}

export default PalDChatbot;
