import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Mountain, ChevronRight, RotateCcw } from "lucide-react";
import { Streamdown } from "streamdown";
import { trpc } from "@/lib/trpc";
import { useHiking } from "@/contexts/HikingContext";
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS, DIFFICULTY_ICON } from "@/types/hiking";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTED_PROMPTS = [
  "我是徒步新手，想走1-2天的线路",
  "推荐适合情侣的浪漫徒步线路",
  "我想挑战高海拔雪山徒步",
  "有哪些文化底蕴丰富的线路？",
];

// Parse trail slugs from AI response
function parseTrailSlugs(content: string): string[] {
  const regex = /\[TRAIL_SLUG:([a-z0-9-]+)\]/g;
  const slugs: string[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    if (!slugs.includes(match[1])) slugs.push(match[1]);
  }
  return slugs;
}

// Clean display content (remove TRAIL_SLUG markers)
function cleanContent(content: string): string {
  return content.replace(/\s*\[TRAIL_SLUG:[a-z0-9-]+\]/g, "");
}

interface TrailChipProps {
  slug: string;
  onNavigate: (slug: string) => void;
}

function TrailChip({ slug, onNavigate }: TrailChipProps) {
  const { data: trail } = trpc.trails.bySlug.useQuery({ slug });
  if (!trail) return null;
  const diffColor = DIFFICULTY_COLORS[trail.difficulty];
  const diffIcon = DIFFICULTY_ICON[trail.difficulty];
  const diffLabel = DIFFICULTY_LABELS[trail.difficulty];

  return (
    <button
      onClick={() => onNavigate(slug)}
      className="group flex items-center gap-2 w-full bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/40 rounded-xl p-3 transition-all duration-200 text-left mt-2"
    >
      {trail.coverImage && (
        <img
          src={trail.coverImage}
          alt={trail.name}
          className="w-12 h-12 rounded-lg object-cover shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${diffColor}`}>
            {diffIcon} {diffLabel}
          </span>
        </div>
        <p className="text-sm font-semibold text-foreground font-serif-sc truncate">{trail.name}</p>
        <p className="text-xs text-muted-foreground">{trail.region} · {trail.duration}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-primary shrink-0 group-hover:translate-x-0.5 transition-transform" />
    </button>
  );
}

export function HikingChatPanel() {
  const { navigateToTrail } = useHiking();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const recommend = trpc.ai.recommend.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
      setIsLoading(false);
    },
    onError: () => {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "抱歉，我暂时遇到了一些问题，请稍后再试。",
      }]);
      setIsLoading(false);
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = (content: string) => {
    if (!content.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: content.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    recommend.mutate({ messages: newMessages });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat Header */}
      <div
        className="px-4 py-3.5 flex items-center justify-between flex-shrink-0 border-b border-border"
        style={{ background: "linear-gradient(135deg, oklch(0.38 0.09 155) 0%, oklch(0.30 0.08 165) 100%)" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold font-serif-sc">山行 · AI向导</p>
            <p className="text-white/70 text-xs">智能线路推荐助手</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {messages.length > 0 && (
            <button
              onClick={resetChat}
              className="text-white/70 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
              title="重新开始"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4"
      >
        {messages.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col h-full justify-center">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Mountain className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground font-serif-sc mb-1">你好，我是山行</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                告诉我你的徒步经验、时间和偏好，我来为你推荐最适合的线路
              </p>
            </div>

            {/* Suggested Prompts */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground text-center mb-3">试试这些问题：</p>
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt)}
                  className="w-full text-left text-sm bg-muted/60 hover:bg-muted border border-border hover:border-primary/30 rounded-xl px-4 py-3 text-foreground transition-all duration-200 hover:shadow-sm"
                >
                  <span className="text-primary mr-2">✦</span>
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isUser = msg.role === "user";
            const slugs = !isUser ? parseTrailSlugs(msg.content) : [];
            const displayContent = !isUser ? cleanContent(msg.content) : msg.content;

            return (
              <div key={i} className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  isUser ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                }`}>
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[85%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isUser
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-card border border-border text-foreground rounded-tl-sm shadow-sm"
                  }`}>
                    {isUser ? (
                      <p>{displayContent}</p>
                    ) : (
                      <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2">
                        <Streamdown>{displayContent}</Streamdown>
                      </div>
                    )}
                  </div>

                  {/* Trail Chips */}
                  {slugs.length > 0 && (
                    <div className="w-full mt-1 space-y-1">
                      {slugs.map((slug) => (
                        <TrailChip key={slug} slug={slug} onNavigate={navigateToTrail} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border flex-shrink-0 bg-background">
        <div className="flex items-end gap-2 bg-muted/50 border border-border rounded-2xl px-4 py-2.5 focus-within:border-primary/50 focus-within:bg-white transition-all duration-200">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="告诉我你的徒步需求..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none leading-relaxed max-h-28 overflow-y-auto scrollbar-thin"
            style={{ minHeight: "1.5rem" }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 transition-all duration-200 hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Enter 发送 · Shift+Enter 换行
        </p>
      </div>
    </div>
  );
}
