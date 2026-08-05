import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import wattson from "@/assets/wattson-avatar.png";

type Msg = { id: number; role: "wattson" | "visitor"; text: string };

const OPENING = `Hi, I'm Wattson 👋

I'm your Clean Energy Guru guide — helping you one Watt at a time ⚡

Whether you're curious about solar, batteries, EV charging or just trying to make sense of your energy options, ask me anything.

What can I help you understand?`;

const SUGGESTIONS = [
  "Is solar right for my home?",
  "How does battery storage work?",
  "What is Energy IQ?",
  "I'm not sure where to start",
];

const ERROR_REPLY =
  "Sorry — I couldn't get through to my energy brain just then. Could you try asking me again in a moment?";

const CHAT_ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/wattson-chat`;


const Avatar = ({ className = "h-8 w-8" }: { className?: string }) => (
  <img
    src={wattson}
    alt="Wattson, the Clean Energy Gurus digital energy guide"
    width={512}
    height={512}
    loading="lazy"
    className={`${className} rounded-full object-cover bg-accent ring-1 ring-border shrink-0`}
  />
);

export const WattsonChat = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Msg[]>([
    { id: 0, role: "wattson", text: OPENING },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, open, loading]);


  const send = async (text: string) => {
    const value = text.trim();
    if (!value || loading) return;

    const history = [
      ...messages
        .filter((m) => m.id !== 0)
        .map((m) => ({ role: m.role === "wattson" ? "assistant" : "user", content: m.text })),
      { role: "user", content: value },
    ];

    const userId = Date.now();
    const replyId = userId + 1;
    setMessages((prev) => [...prev, { id: userId, role: "visitor", text: value }]);
    setInput("");
    setLoading(true);
    inputRef.current?.focus();

    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok || !res.body) throw new Error(`chat failed: ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let answer = "";
      let started = false;

      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (!data || data === "[DONE]") continue;
          try {
            const delta = JSON.parse(data)?.choices?.[0]?.delta?.content;
            if (typeof delta !== "string" || !delta) continue;
            answer += delta;
            if (!started) {
              started = true;
              setLoading(false);
              setMessages((prev) => [...prev, { id: replyId, role: "wattson", text: answer }]);
            } else {
              setMessages((prev) =>
                prev.map((m) => (m.id === replyId ? { ...m, text: answer } : m)),
              );
            }
          } catch {
            /* ignore malformed chunk */
          }
        }
      }

      if (!answer.trim()) throw new Error("empty response");
    } catch (err) {
      console.error("Wattson chat error", err);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== replyId),
        { id: replyId, role: "wattson", text: ERROR_REPLY },
      ]);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Ask Wattson, our digital energy guide"
          className="fixed z-50 bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 sm:bottom-6 sm:right-6 flex items-center gap-2.5 rounded-full bg-gradient-electric text-white shadow-glow hover:shadow-elegant hover:-translate-y-0.5 transition-all duration-300 p-1.5 sm:pr-5 animate-scale-in motion-reduce:animate-none"
        >
          <Avatar className="h-11 w-11 sm:h-10 sm:w-10 ring-white/40" />
          <span className="hidden sm:inline text-sm font-semibold font-display pr-1">
            Ask Wattson
          </span>
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label="Chat with Wattson"
          className="fixed z-50 inset-x-0 bottom-0 top-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:top-auto sm:w-[380px] sm:h-[560px] sm:max-h-[calc(100vh-3rem)] flex flex-col overflow-hidden bg-background sm:rounded-3xl sm:border sm:border-border sm:shadow-elegant animate-fade-in motion-reduce:animate-none"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-electric text-white pt-[calc(0.875rem+env(safe-area-inset-top))] sm:pt-3.5">
            <Avatar className="h-10 w-10 ring-white/40" />
            <div className="min-w-0">
              <div className="font-display font-semibold leading-tight">Wattson</div>
              <div className="text-xs text-white/80 leading-tight">
                Your Clean Energy Guide
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="ml-auto p-2 rounded-full hover:bg-white/15 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-surface"
            aria-live="polite"
          >
            {messages.map((m) =>
              m.role === "wattson" ? (
                <div key={m.id} className="flex gap-2.5">
                  <Avatar className="h-7 w-7 mt-0.5" />
                  <div className="rounded-2xl rounded-tl-sm bg-background border border-border px-3.5 py-2.5 text-sm text-navy-soft whitespace-pre-line leading-relaxed shadow-card">
                    {m.text}
                  </div>
                </div>
              ) : (
                <div key={m.id} className="flex justify-end">
                  <div className="rounded-2xl rounded-tr-sm bg-navy text-primary-foreground px-3.5 py-2.5 text-sm leading-relaxed max-w-[85%]">
                    {m.text}
                  </div>
                </div>
              ),
            )}

            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 pl-9 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-electric/30 bg-accent text-accent-foreground px-3.5 py-2 text-xs font-medium hover:border-electric hover:bg-background transition-colors text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex gap-2.5" aria-label="Wattson is typing">
                <Avatar className="h-7 w-7 mt-0.5" />
                <div className="rounded-2xl rounded-tl-sm bg-background border border-border px-3.5 py-3 shadow-card flex items-center gap-1.5">
                  {[0, 150, 300].map((d) => (
                    <span
                      key={d}
                      style={{ animationDelay: `${d}ms` }}
                      className="h-1.5 w-1.5 rounded-full bg-electric animate-bounce motion-reduce:animate-none"
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />

          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border bg-background px-3 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-3"
          >
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Wattson a question…"
              aria-label="Ask Wattson a question"
              className="rounded-full border-border bg-surface focus-visible:ring-electric"
            />
            <Button
              type="submit"
              size="icon"
              aria-label="Send message"
              disabled={!input.trim() || loading}
              className="rounded-full bg-gradient-electric text-white border-0 shrink-0 hover:opacity-95"
            >
              <Send className="h-4 w-4" />
            </Button>

          </form>
        </div>
      )}
    </>
  );
};
