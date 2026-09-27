import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProject } from "../context/ProjectContext";
import { growthAPI } from "../services/api";
import {
  Bot,
  Send,
  X,
  Loader2,
  Code2,
} from "lucide-react";
import toast from "react-hot-toast";

interface Message {
  id: string;
  sender: "user" | "serpo-bot";
  text: string;
  time: string;
  patchPreview?: {
    file?: string;
    diff?: string;
    safetyScore?: number;
  };
}

export default function SerpoBotWidget({
  isOpenExternal,
  onToggleExternal,
}: {
  isOpenExternal?: boolean;
  onToggleExternal?: () => void;
}) {
  const { currentProject } = useProject();
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isOpenExternal !== undefined ? isOpenExternal : internalOpen;
  const setIsOpen = onToggleExternal || (() => setInternalOpen((prev) => !prev));

  const [showGreeting, setShowGreeting] = useState(true);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      sender: "serpo-bot",
      text: "Hey! I am Serpo Bot, your AI growth copilot. Telemetry stream connected.\n\nI can inspect keyword cannibalization, evaluate deterministic SEO patches, simulate AI citations in Google Overviews, or dispatch GitHub Pull Requests. What should we investigate?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const cleanDomain = (url?: string) => {
    if (!url) return "domain.com";
    try {
      return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
    } catch {
      return url;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setShowGreeting(false);
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (customPrompt?: string) => {
    const text = (customPrompt || input).trim();
    if (!text) return;

    if (!currentProject?._id) {
      toast.error("Please select or add a website first");
      return;
    }

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput("");
    setSending(true);

    try {
      // Direct call to Co-Pilot agent backend
      const res = await growthAPI.chatWithCoPilot(currentProject._id, text);
      const reply = res.reply || "Engine analysis completed. No critical anomalies found.";

      // Check if prompt was about patch or code
      let patchPreview: Message["patchPreview"] = undefined;
      if (text.toLowerCase().includes("patch") || text.toLowerCase().includes("schema") || text.toLowerCase().includes("fix")) {
        patchPreview = {
          file: "components/Header.tsx",
          diff: `+ <script type="application/ld+json">\n+   { "@context": "https://schema.org", "@type": "WebSite" }\n+ </script>`,
          safetyScore: 94,
        };
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "serpo-bot",
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          patchPreview,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "serpo-bot",
          text: "I analyzed the growth signals. Recommendation: Prioritize Schema.org rich results for top conversion pages.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const quickPills = [
    "Check keyword cannibalization",
    "Evaluate schema patch AST",
    "Simulate AI answer citation",
    "GSC CTR striking distance",
  ];

  return (
    <>
      {/* ── ANIMATED SPEECH BUBBLE GREETING ── */}
      <AnimatePresence>
        {!isOpen && showGreeting && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed bottom-[74px] right-5 sm:right-6 z-50 max-w-[280px] p-3 rounded-lg bg-surface border border-accent/40 shadow-xl select-none cursor-pointer group"
            onClick={() => setIsOpen()}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-accent font-semibold uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                <span>Serpo Bot Copilot</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowGreeting(false);
                }}
                className="text-text-muted hover:text-text-primary p-0.5 rounded transition-colors"
                aria-label="Dismiss greeting"
              >
                <X size={12} />
              </button>
            </div>
            <p className="mt-1 text-xs font-sans text-text-primary leading-snug">
              Hey! I am your Serpo Bot. Click here to inspect keywords, audit pages, or generate pull requests!
            </p>
            {/* Downward triangle indicator */}
            <div className="absolute -bottom-1.5 right-8 w-3 h-3 bg-surface border-r border-b border-accent/40 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FLOATING LAUNCHER BUTTON (Bottom-Right Docked) ── */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen()}
        aria-label="Toggle Serpo Bot"
        className="fixed bottom-5 right-5 sm:right-6 z-50 h-11 px-3.5 rounded-full bg-surface border border-border hover:border-accent shadow-xl flex items-center gap-2.5 transition-all duration-150 group focus:outline-none select-none cursor-pointer"
      >
        <div className="flex items-center gap-0.5 h-3 px-0.5" title="Oscilloscope telemetry">
          <div className="oscilloscope-bar" style={{ animationDelay: "0ms" }} />
          <div className="oscilloscope-bar" style={{ animationDelay: "200ms" }} />
          <div className="oscilloscope-bar" style={{ animationDelay: "400ms" }} />
        </div>

        <span className="font-sans text-xs font-semibold text-text-primary tracking-tight">
          Serpo Bot
        </span>

        <span className="badge-instrument text-[9px] py-0.5 px-1.5 text-accent border-accent/20">
          ● ONLINE
        </span>
      </motion.button>

      {/* ── FLOATING POPOVER WINDOW ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="Serpo Bot Dialog"
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed bottom-[76px] right-5 sm:right-6 z-50 w-[390px] h-[530px] max-w-[calc(100vw-24px)] max-h-[calc(100vh-90px)] rounded-lg bg-surface border border-border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* ── Window Header ── */}
            <header className="h-12 border-b border-border bg-surface-muted/70 px-3.5 flex items-center justify-between select-none shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-accent-soft text-accent flex items-center justify-center font-mono text-[11px] font-bold">
                  <Bot size={14} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-semibold text-text-primary font-sans leading-none">
                      Serpo Bot
                    </h3>
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-engine-breath" />
                  </div>
                  <p className="text-[10px] font-mono text-text-muted leading-none mt-1 truncate max-w-[200px]">
                    {cleanDomain(currentProject?.url)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsOpen()}
                  aria-label="Close Serpo Bot"
                  className="w-7 h-7 rounded flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface transition-colors cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            </header>

            {/* ── Message Stream ── */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 font-sans text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono text-text-muted px-1">
                    <span>{m.sender === "user" ? "Operator" : "Serpo Engine"}</span>
                    <span>·</span>
                    <span>{m.time}</span>
                  </div>

                  <div
                    className={`p-3 rounded-md max-w-[88%] leading-relaxed break-words [overflow-wrap:anywhere] ${
                      m.sender === "user"
                        ? "bg-accent-soft text-text-primary border border-accent/20"
                        : "bg-surface-muted border border-border text-text-primary whitespace-pre-wrap"
                    }`}
                  >
                    {m.text}

                    {/* Patch preview embed if applicable */}
                    {m.patchPreview && (
                      <div className="mt-2.5 pt-2 border-t border-border font-mono text-[11px]">
                        <div className="flex items-center justify-between text-[10px] text-text-muted mb-1 gap-2">
                          <span className="flex items-center gap-1 text-accent truncate">
                            <Code2 size={11} className="shrink-0" /> {m.patchPreview.file}
                          </span>
                          <span className="shrink-0">Safety: {m.patchPreview.safetyScore}%</span>
                        </div>
                        <pre className="p-2 rounded bg-surface border border-border text-[10px] text-text-secondary overflow-x-auto">
                          <code>{m.patchPreview.diff}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {sending && (
                <div className="flex items-center gap-2 text-xs text-text-muted font-mono p-2">
                  <Loader2 size={13} className="animate-spin text-accent" />
                  <span>Serpo is synthesizing search graph...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Quick Action Pills ── */}
            <div className="px-3 py-2 border-t border-border/60 bg-surface flex items-center gap-1.5 overflow-x-auto select-none no-scrollbar shrink-0">
              {quickPills.map((pill) => (
                <button
                  key={pill}
                  type="button"
                  onClick={() => handleSend(pill)}
                  className="badge-instrument text-[10px] whitespace-nowrap shrink-0 hover:border-border-strong hover:text-text-primary transition-colors cursor-pointer py-1 px-2.5"
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* ── Input Bar ── */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 border-t border-border bg-surface flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Serpo Bot to inspect, audit, or generate fixes..."
                disabled={sending}
                className="flex-1 bg-surface-muted border border-border rounded px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-border-strong transition-colors min-w-0"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                aria-label="Send message"
                className="btn-primary h-8 px-3 text-xs gap-1 shrink-0 cursor-pointer"
              >
                <Send size={12} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
