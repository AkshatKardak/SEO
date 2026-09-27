import { useState, useRef, useEffect } from "react";
import { useProject } from "../context/ProjectContext";
import { growthAPI } from "../services/api";
import {
  Bot,
  Sparkles,
  Send,
  X,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

export default function GrowthCopilotDrawer() {
  const { currentProject } = useProject();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "user" | "copilot"; text: string; time: string }>>([
    {
      sender: "copilot",
      text: "Hi! I'm your AI Growth Co-Pilot. I can answer questions about your site's conversion bottlenecks, GEO AI visibility, competitor teardowns, or formulate growth experiments. What would you like to explore?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (msgText?: string) => {
    const textToSend = msgText || input;
    if (!textToSend.trim() || !currentProject) return;

    const userMsg = {
      sender: "user" as const,
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!msgText) setInput("");
    setSending(true);

    try {
      const res = await growthAPI.chatWithCoPilot(currentProject._id, textToSend.trim());
      const botMsg = {
        sender: "copilot" as const,
        text: res.reply || "I analyzed your growth graph. Focus initial resources on pricing proof and comparison assets.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      toast.error(err.message || "Co-Pilot response failed");
    } finally {
      setSending(false);
    }
  };

  const quickPrompts = [
    "What should I do today to increase conversions?",
    "How can I get cited in Google AI Overviews and answer engines?",
    "Suggest a high-intent comparison angle for our product",
    "How can we fix our top technical SEO issues?",
  ];

  if (!currentProject) return null;

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full btn-glow text-xs font-extrabold shadow-2xl transition-transform hover:scale-105"
      >
        <Sparkles size={16} />
        <span>Ask Growth Co-Pilot</span>
      </button>

      {/* Slide-Over Drawer */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 z-50 bg-card border-l border-border shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between bg-muted/40">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-foreground">AI Growth Co-Pilot</h3>
                <span className="text-[10px] text-success flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping inline-block" />
                  Active on {currentProject.domain}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "copilot" && (
                  <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={12} />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                    m.sender === "user"
                      ? "bg-primary text-primary-foreground font-medium rounded-tr-none"
                      : "bg-muted text-foreground border border-border/80 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  <span
                    className={`block text-[9px] mt-1 ${
                      m.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {m.time}
                  </span>
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                <Loader2 size={14} className="animate-spin text-primary" />
                <span>Co-Pilot is analyzing knowledge graph...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-3 border-t border-border/60 bg-card">
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  disabled={sending}
                  className="px-2.5 py-1 rounded-lg bg-muted text-[10px] text-muted-foreground hover:text-foreground hover:bg-muted/80 whitespace-nowrap shrink-0 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 mt-1"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Co-Pilot about strategy, SEO, GEO..."
                disabled={sending}
                className="flex-1 px-3 py-2 rounded-xl bg-muted border border-border text-xs text-foreground outline-none"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="p-2 rounded-xl btn-glow text-primary-foreground disabled:opacity-40"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
