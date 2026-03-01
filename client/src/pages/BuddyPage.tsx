import { useState } from "react";
import { Users, Plus, MapPin, Calendar, DollarSign, MessageCircle, Mountain, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { useHiking } from "@/contexts/HikingContext";
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS } from "@/types/hiking";

export function BuddyPage() {
  const { isAuthenticated } = useAuth();
  const { navigateToTrail } = useHiking();
  const utils = trpc.useUtils();
  const [createOpen, setCreateOpen] = useState(false);

  const { data: posts = [], isLoading } = trpc.buddy.list.useQuery({ status: "open" });

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [departureCity, setDepartureCity] = useState("");
  const [targetCount, setTargetCount] = useState("4");
  const [budget, setBudget] = useState("");
  const [requirements, setRequirements] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const createPost = trpc.buddy.create.useMutation({
    onSuccess: () => {
      toast.success("征集帖子发布成功！");
      setCreateOpen(false);
      setTitle(""); setContent(""); setDepartureDate("");
      setDepartureCity(""); setTargetCount("4");
      setBudget(""); setRequirements(""); setContactInfo("");
      utils.buddy.list.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const handleSubmit = () => {
    if (!title || !content || !departureDate) {
      toast.error("请填写必填项");
      return;
    }
    createPost.mutate({
      title,
      content,
      departureDate,
      departureCity: departureCity || undefined,
      targetCount: parseInt(targetCount),
      budget: budget || undefined,
      requirements: requirements || undefined,
      contactInfo: contactInfo || undefined,
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="px-5 py-5 flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, oklch(0.42 0.10 200) 0%, oklch(0.32 0.08 220) 100%)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white text-lg font-serif-sc font-semibold mb-0.5">找徒步搭子</h2>
            <p className="text-white/75 text-xs">发布征集 · 寻找同行伙伴</p>
          </div>
          {isAuthenticated ? (
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-white text-primary hover:bg-white/90 gap-1.5 font-medium">
                  <Plus className="w-3.5 h-3.5" />
                  发布征集
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-serif-sc">发布找搭子帖子</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">帖子标题 *</Label>
                    <Input
                      placeholder="如：招募3人！8月四姑娘山徒步，成都出发"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">详细介绍 *</Label>
                    <Textarea
                      placeholder="介绍你的计划、行程安排、对搭子的期望等..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">出发日期 *</Label>
                      <Input
                        placeholder="如：2025年8月10日"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">出发城市</Label>
                      <Input
                        placeholder="如：成都"
                        value={departureCity}
                        onChange={(e) => setDepartureCity(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">招募人数</Label>
                      <Select value={targetCount} onValueChange={setTargetCount}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[2,3,4,5,6,8,10,15,20].map(n => (
                            <SelectItem key={n} value={String(n)}>{n}人</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">预算范围</Label>
                      <Input
                        placeholder="如：人均2000元"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">对搭子的要求</Label>
                    <Textarea
                      placeholder="如：有高原徒步经验，体能良好，性格开朗..."
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">联系方式</Label>
                    <Input
                      placeholder="如：微信：your_wechat"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" onClick={handleSubmit} disabled={createPost.isPending}>
                    {createPost.isPending ? "发布中..." : "发布帖子"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Button
              size="sm"
              className="bg-white text-primary hover:bg-white/90 gap-1.5 font-medium"
              onClick={() => window.location.href = getLoginUrl()}
            >
              <Plus className="w-3.5 h-3.5" />
              登录发布
            </Button>
          )}
        </div>
      </div>

      {/* Posts List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-2">
                <div className="h-4 skeleton rounded w-3/4" />
                <div className="h-3 skeleton rounded w-full" />
                <div className="h-3 skeleton rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Users className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground font-medium">暂无征集帖子</p>
            <p className="text-sm text-muted-foreground/70 mt-1">成为第一个发布征集的人吧！</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map(({ post, userName, trailName, trailSlug, trailDifficulty }) => (
              <div key={post.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-md transition-all duration-200">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-foreground font-serif-sc leading-snug flex-1">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-emerald-600 font-medium">招募中</span>
                  </div>
                </div>

                {/* Trail Link */}
                {trailName && trailSlug && (
                  <button
                    onClick={() => navigateToTrail(trailSlug)}
                    className="flex items-center gap-1.5 text-xs text-primary mb-2 hover:underline"
                  >
                    <Mountain className="w-3 h-3" />
                    {trailName}
                    {trailDifficulty && (
                      <span className={`px-1.5 py-0.5 rounded-full text-xs ${DIFFICULTY_COLORS[trailDifficulty as keyof typeof DIFFICULTY_COLORS]}`}>
                        {DIFFICULTY_LABELS[trailDifficulty as keyof typeof DIFFICULTY_LABELS]}
                      </span>
                    )}
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}

                <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                  {post.content}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                    <Calendar className="w-3 h-3" />
                    {post.departureDate}
                  </span>
                  {post.departureCity && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      <MapPin className="w-3 h-3" />
                      {post.departureCity}出发
                    </span>
                  )}
                  {post.budget && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      <DollarSign className="w-3 h-3" />
                      {post.budget}
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                      {(userName || "匿")[0]}
                    </div>
                    <span className="text-xs text-muted-foreground">{userName || "匿名"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-foreground">
                      <span className="text-primary">{post.currentCount}</span>
                      <span className="text-muted-foreground">/{post.targetCount}人</span>
                    </span>
                    {post.contactInfo && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(post.contactInfo!);
                          toast.success("联系方式已复制");
                        }}
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        联系TA
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
