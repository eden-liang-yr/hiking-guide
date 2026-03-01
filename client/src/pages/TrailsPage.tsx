import { useState, useMemo } from "react";
import { Search, Filter, Mountain, Leaf, Compass, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { TrailCard } from "@/components/TrailCard";
import { useHiking } from "@/contexts/HikingContext";
import type { Difficulty } from "@/types/hiking";

const DIFFICULTY_TABS: { key: Difficulty | "all"; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: "all", label: "全部线路", icon: <Compass className="w-4 h-4" />, desc: "探索所有精选路线" },
  { key: "beginner", label: "新手", icon: <Leaf className="w-4 h-4" />, desc: "适合初次尝试者" },
  { key: "intermediate", label: "中阶", icon: <Mountain className="w-4 h-4" />, desc: "需要一定经验" },
  { key: "advanced", label: "高手", icon: <Sparkles className="w-4 h-4" />, desc: "挑战极限之旅" },
];

export function TrailsPage() {
  const { navigateToTrail } = useHiking();
  const [activeTab, setActiveTab] = useState<Difficulty | "all">("all");
  const [search, setSearch] = useState("");

  const { data: trails = [], isLoading } = trpc.trails.list.useQuery(
    activeTab === "all" ? {} : { difficulty: activeTab }
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return trails;
    const q = search.toLowerCase();
    return trails.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.region.toLowerCase().includes(q) ||
        (t.province || "").toLowerCase().includes(q)
    );
  }, [trails, search]);

  const featured = useMemo(() => filtered.filter((t) => t.featured), [filtered]);
  const regular = useMemo(() => filtered.filter((t) => !t.featured), [filtered]);

  return (
    <div className="flex flex-col h-full">
      {/* Hero Banner */}
      <div
        className="relative h-52 flex-shrink-0 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, oklch(0.28 0.09 155) 0%, oklch(0.22 0.07 175) 50%, oklch(0.32 0.08 130) 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative h-full flex flex-col justify-center px-6">
          <p className="text-white/70 text-sm font-sans-sc tracking-widest uppercase mb-1">Hiking Guide</p>
          <h1 className="text-white text-2xl font-serif-sc font-semibold mb-2">
            探索自然之路
          </h1>
          <p className="text-white/80 text-sm max-w-md">
            从城市公园到雪山之巅，为每一位徒步者找到最适合的线路
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="px-4 py-4 bg-background border-b border-border flex-shrink-0">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索线路名称、地区..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/50 border-border/50 focus:bg-white"
          />
        </div>

        {/* Difficulty Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {DIFFICULTY_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trail List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="h-44 skeleton" />
                <div className="p-4 space-y-2">
                  <div className="h-4 skeleton rounded w-3/4" />
                  <div className="h-3 skeleton rounded w-1/2" />
                  <div className="h-3 skeleton rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Mountain className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground font-medium">暂无匹配线路</p>
            <p className="text-sm text-muted-foreground/70 mt-1">尝试调整搜索条件</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Featured */}
            {featured.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h2 className="text-sm font-semibold text-foreground font-serif-sc">精选推荐</h2>
                  <span className="text-xs text-muted-foreground">({featured.length})</span>
                </div>
                <div className="space-y-3">
                  {featured.map((trail) => (
                    <TrailCard key={trail.id} trail={trail} onClick={navigateToTrail} />
                  ))}
                </div>
              </section>
            )}

            {/* Regular */}
            {regular.length > 0 && (
              <section>
                {featured.length > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-foreground font-serif-sc">更多线路</h2>
                    <span className="text-xs text-muted-foreground">({regular.length})</span>
                  </div>
                )}
                <div className="space-y-3">
                  {regular.map((trail) => (
                    <TrailCard key={trail.id} trail={trail} onClick={navigateToTrail} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
