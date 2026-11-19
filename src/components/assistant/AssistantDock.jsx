import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, X, Loader2, Sparkles, Plus } from "lucide-react";

const AGENT_NAME = "idea_spark_assistant";
const STORAGE_KEY = "spark_assistant_conversation_id";

const STARTERS = [
  "What should I do next?",
  "Which industry fits my idea?",
  "Explain my latest concept",
  "How do I hand off to App Forge?"
];

export default function AssistantDock() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const bottomRef = useRef(null);

  const conversationId = conversation?.id;

  const startConversation = async () => {
    const created = await base44.agents.createConversation({
      agent_name: AGENT_NAME,
      metadata: { name: "Idea Spark Assistant", description: "In-app assistant conversation" }
    });
    if (created?.id) localStorage.setItem(STORAGE_KEY, created.id);
    setConversation(created);
    setMessages(created?.messages || []);
    return created;
  };

  useEffect(() => {
    if (!isOpen || conversation) return;
    let cancelled = false;
    (async () => {
      setIsStarting(true);
      try {
        const savedId = localStorage.getItem(STORAGE_KEY);
        if (savedId) {
          try {
            const existing = await base44.agents.getConversation(savedId);
            if (!cancelled && existing?.id) {
              setConversation(existing);
              setMessages(existing.messages || []);
              return;
            }
          } catch (e) {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
        if (!cancelled) await startConversation();
      } finally {
        if (!cancelled) setIsStarting(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen, conversation]);

  useEffect(() => {
    if (!conversationId) return;
    const unsubscribe = base44.agents.subscribeToConversation(conversationId, (data) => {
      setMessages(data.messages || []);
    });
    return () => unsubscribe();
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const send = async (text) => {
    const content = text.trim();
    if (!content) return;
    let conv = conversation;
    setInput("");
    if (!conv) {
      setInput("");
      conv = await startConversation();
    }
    setMessages((prev) => [...prev, { role: "user", content }]);
    await base44.agents.addMessage(conv, { role: "user", content });
  };

  const reset = async () => {
    localStorage.removeItem(STORAGE_KEY);
    setConversation(null);
    setMessages([]);
    await startConversation();
  };

  const isBusy = isStarting || (messages.length > 0 && messages[messages.length - 1]?.role === "user");

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 px-4 py-3 text-white shadow-xl shadow-purple-900/40 hover:from-blue-500 hover:to-purple-500 transition-colors"
          aria-label="Open the Idea Spark assistant"
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-semibold">Ask the assistant</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-x-3 bottom-3 top-16 md:inset-auto md:bottom-6 md:right-6 md:top-auto md:w-[400px] md:h-[580px] z-50 flex flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 bg-slate-950/80 px-4 py-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">Idea Spark Assistant</p>
                <p className="text-[11px] text-slate-400 truncate">Ask anything about your research</p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={reset}
                className="text-slate-400 hover:text-white hover:bg-slate-800"
                aria-label="Start a new conversation"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-800"
                aria-label="Close the assistant"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-slate-300">
                  Hi — I know how Idea Spark fits together. Ask me what to research next, or try one of these:
                </p>
                <div className="flex flex-wrap gap-2">
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1.5 text-xs text-slate-200 hover:border-purple-500/60 hover:text-white"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, idx) => {
              const isUser = message.role === "user";
              return (
                <div key={idx} className={isUser ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={
                      isUser
                        ? "max-w-[85%] rounded-2xl rounded-br-sm bg-blue-600 px-3 py-2 text-sm text-white"
                        : "max-w-[90%] rounded-2xl rounded-bl-sm bg-slate-800 px-3 py-2 text-sm text-slate-100"
                    }
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                        <ReactMarkdown>{message.content || ""}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isBusy && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Thinking...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-slate-800 bg-slate-950/80 p-3">
            <div className="flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Ask about industries, concepts or next steps..."
                className="min-h-[44px] max-h-28 resize-none bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                rows={1}
              />
              <Button
                onClick={() => send(input)}
                disabled={!input.trim() || isStarting}
                className="gradient-button h-11 w-11 p-0 flex-shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}