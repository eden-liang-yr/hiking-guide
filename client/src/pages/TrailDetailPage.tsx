import { useState } from "react";
import {
  ArrowLeft, MapPin, Clock, TrendingUp, Star, Calendar, DollarSign,
  Backpack, Car, Home, ThumbsUp, ThumbsDown, BookOpen, AlertTriangle,
  ExternalLink, Users, ChevronDown, ChevronUp, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useHiking } from "@/contexts/HikingContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS, DIFFICULTY_ICON, GROUP_TYPE_LABELS } from "@/types/hiking";

interface StarRatingProps {
  value: number;
  onChange?: (v: number) => void;
  size?: "sm" | "md";
}

function StarRating({ value, onChange, size = "md" }: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const sz = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${sz} transition-colors ${
            s <= (hover || value) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
          } ${onChange ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
          onClick={() => onChange?.(s)}
          onMouseEnter={() => onChange && setHover(s)}
          onMouseLeave={() => onChange && setHover(0)}
        />
      ))}
    </div>
  );
}

export function TrailDetailPage() {
  const { selectedTrailSlug, navigateToList } = useHiking();
  const { user, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const { data: trail, isLoading } = trpc.trails.bySlug.useQuery(
    { slug: selectedTrailSlug! },
    { enabled: !!selectedTrailSlug }
  );

  const { data: reviews = [] } = trpc.reviews.byTrail.useQuery(
    { trailId: trail?.id ?? 0 },
    { enabled: !!trail?.id }
  );

  const { data: tourGroups = [] } = trpc.trails.tourGroups.useQuery(
    { trailId: trail?.id ?? 0 },
    { enabled: !!trail?.id }
  );

  const { data: myReview } = trpc.reviews.myReview.useQuery(
    { trailId: trail?.id ?? 0 },
    { enabled: !!trail?.id && isAuthenticated }
  );

  // Review form state
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [hikingDate, setHikingDate] = useState("");
  const [groupType, setGroupType] = useState<string>("");
  const [expandedCultural, setExpandedCultural] = useState(false);

  const createReview = trpc.reviews.create.useMutation({
    onSuccess: () => {
      toast.success("评价发布成功！");
      setReviewOpen(false);
      setRating(5);
      setReviewTitle("");
      setReviewContent("");
      utils.reviews.byTrail.invalidate({ trailId: trail?.id });
      utils.reviews.myReview.invalidate({ trailId: trail?.id });
      utils.trails.bySlug.invalidate({ slug: selectedTrailSlug! });
    },
    onError: (e) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="h-56 skeleton flex-shrink-0" />
        <div className="p-4 space-y-3">
          <div className="h-6 skeleton rounded w-2/3" />
          <div className="h-4 skeleton rounded w-1/2" />
          <div className="h-4 skeleton rounded w-full" />
          <div className="h-4 skeleton rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (!trail) return null;

  const diffLabel = DIFFICULTY_LABELS[trail.difficulty];
  const diffColor = DIFFICULTY_COLORS[trail.difficulty];
  const diffIcon = DIFFICULTY_ICON[trail.difficulty];
  const highlights = trail.highlights as string[];
  const equipment = trail.equipment as string[];
  const pros = trail.pros as string[];
  const cons = trail.cons as string[];

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin">
      {/* Hero Image */}
      <div className="relative h-52 flex-shrink-0 overflow-hidden">
        {trail.coverImage ? (
          <img src={trail.coverImage} alt={trail.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: "linear-gradient(135deg, oklch(0.38 0.09 155), oklch(0.28 0.07 175))" }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Back Button */}
        <button
          onClick={navigateToList}
          className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/40 hover:bg-black/60 text-white text-sm px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          返回
        </button>

        {/* Hero Info */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 ${diffColor}`}>
              {diffIcon} {diffLabel}
            </span>
            {trail.featured && (
              <span className="bg-amber-400 text-amber-900 text-xs font-semibold px-2.5 py-1 rounded-full">
                ✦ 精选
              </span>
            )}
          </div>
          <h1 className="text-white text-xl font-serif-sc font-semibold text-shadow mb-1">
            {trail.name}
          </h1>
          <div className="flex items-center gap-3 text-white/80 text-xs">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{trail.region}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{trail.duration}</span>
            {trail.distance && <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{trail.distance}</span>}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 border-b border-border flex-shrink-0">
        {[
          { icon: <Star className="w-4 h-4 text-amber-500" />, label: "评分", value: trail.avgRating?.toFixed(1) || "—" },
          { icon: <Users className="w-4 h-4 text-blue-500" />, label: "评价", value: `${trail.reviewCount}条` },
          { icon: <DollarSign className="w-4 h-4 text-green-600" />, label: "费用", value: trail.costMin ? `¥${trail.costMin}起` : "—" },
          { icon: <Calendar className="w-4 h-4 text-purple-500" />, label: "海拔", value: trail.elevation?.replace("最高海拔", "") || "—" },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center py-3 px-2 gap-1">
            {stat.icon}
            <span className="text-sm font-semibold text-foreground">{stat.value}</span>
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="flex-1">
        <TabsList className="w-full rounded-none border-b border-border bg-transparent h-auto p-0 flex-shrink-0">
          {[
            { value: "overview", label: "线路概览" },
            { value: "prepare", label: "出行准备" },
            { value: "reviews", label: `评价 (${trail.reviewCount})` },
            { value: "tours", label: "报团出行" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary py-3 text-xs font-medium"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="p-4 space-y-5 mt-0">
          {/* Summary */}
          <div>
            <h3 className="text-sm font-semibold text-foreground font-serif-sc mb-2">线路简介</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{trail.summary}</p>
          </div>

          {/* Highlights */}
          {highlights.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground font-serif-sc mb-2">✨ 线路亮点</h3>
              <div className="flex flex-wrap gap-2">
                {highlights.map((h, i) => (
                  <span key={i} className="bg-primary/8 text-primary text-xs px-3 py-1.5 rounded-full border border-primary/15 font-medium">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pros & Cons */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-700">优点</span>
              </div>
              <ul className="space-y-1.5">
                {pros.map((p, i) => (
                  <li key={i} className="text-xs text-emerald-800 flex items-start gap-1.5">
                    <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-rose-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <ThumbsDown className="w-3.5 h-3.5 text-rose-600" />
                <span className="text-xs font-semibold text-rose-700">注意</span>
              </div>
              <ul className="space-y-1.5">
                {cons.map((c, i) => (
                  <li key={i} className="text-xs text-rose-800 flex items-start gap-1.5">
                    <span className="text-rose-500 mt-0.5 shrink-0">•</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Cultural Background */}
          {trail.culturalBackground && (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <div className="flex items-center gap-1.5 mb-2">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span className="text-xs font-semibold text-amber-800">文化历史背景</span>
              </div>
              <p className={`text-xs text-amber-900 leading-relaxed ${!expandedCultural ? "line-clamp-3" : ""}`}>
                {trail.culturalBackground}
              </p>
              <button
                onClick={() => setExpandedCultural(!expandedCultural)}
                className="flex items-center gap-1 text-xs text-amber-700 mt-1.5 font-medium"
              >
                {expandedCultural ? <><ChevronUp className="w-3 h-3" />收起</> : <><ChevronDown className="w-3 h-3" />展开更多</>}
              </button>
            </div>
          )}

          {/* Tips */}
          {trail.tips && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-semibold text-blue-800">注意事项</span>
              </div>
              <p className="text-xs text-blue-900 leading-relaxed">{trail.tips}</p>
            </div>
          )}
        </TabsContent>

        {/* Prepare Tab */}
        <TabsContent value="prepare" className="p-4 space-y-5 mt-0">
          {/* Best Season */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground font-serif-sc">最佳出行时间</h3>
            </div>
            <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">{trail.bestSeason}</p>
          </div>

          {/* Equipment */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Backpack className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground font-serif-sc">推荐装备</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {equipment.map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-muted/50 rounded-lg p-2.5 text-xs text-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Transportation */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Car className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground font-serif-sc">交通方式</h3>
            </div>
            <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 leading-relaxed">{trail.transportation}</p>
          </div>

          {/* Accommodation */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Home className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground font-serif-sc">住宿建议</h3>
            </div>
            <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 leading-relaxed">{trail.accommodation}</p>
          </div>

          {/* Cost */}
          {(trail.costMin || trail.costMax) && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground font-serif-sc">费用估算</h3>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-green-700">
                    ¥{trail.costMin?.toLocaleString()}
                  </span>
                  {trail.costMax && (
                    <>
                      <span className="text-muted-foreground">—</span>
                      <span className="text-lg font-semibold text-green-600">
                        ¥{trail.costMax?.toLocaleString()}
                      </span>
                    </>
                  )}
                  <span className="text-sm text-muted-foreground">/ 人</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">含交通、住宿、餐饮及门票等综合费用估算</p>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="mt-0">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-3xl font-bold text-foreground font-serif-sc">
                    {trail.avgRating?.toFixed(1)}
                  </span>
                  <StarRating value={Math.round(trail.avgRating || 0)} size="sm" />
                </div>
                <p className="text-xs text-muted-foreground">{trail.reviewCount} 条评价</p>
              </div>
              {isAuthenticated ? (
                !myReview ? (
                  <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-1.5">
                        <Plus className="w-3.5 h-3.5" />
                        写评价
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="font-serif-sc">为「{trail.name}」写评价</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-2">
                        <div>
                          <Label className="text-sm font-medium mb-2 block">综合评分</Label>
                          <StarRating value={rating} onChange={setRating} />
                        </div>
                        <div>
                          <Label className="text-sm font-medium mb-1.5 block">标题（选填）</Label>
                          <Input
                            placeholder="用一句话概括你的体验"
                            value={reviewTitle}
                            onChange={(e) => setReviewTitle(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium mb-1.5 block">详细评价 *</Label>
                          <Textarea
                            placeholder="分享你的徒步体验、建议和感受..."
                            value={reviewContent}
                            onChange={(e) => setReviewContent(e.target.value)}
                            rows={4}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-sm font-medium mb-1.5 block">徒步时间（选填）</Label>
                            <Input
                              placeholder="如：2024年10月"
                              value={hikingDate}
                              onChange={(e) => setHikingDate(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium mb-1.5 block">出行方式（选填）</Label>
                            <Select value={groupType} onValueChange={setGroupType}>
                              <SelectTrigger>
                                <SelectValue placeholder="选择类型" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(GROUP_TYPE_LABELS).map(([k, v]) => (
                                  <SelectItem key={k} value={k}>{v}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => {
                            if (reviewContent.length < 10) {
                              toast.error("评价内容至少10个字");
                              return;
                            }
                            createReview.mutate({
                              trailId: trail.id,
                              rating,
                              title: reviewTitle || undefined,
                              content: reviewContent,
                              hikingDate: hikingDate || undefined,
                              groupType: (groupType as any) || undefined,
                            });
                          }}
                          disabled={createReview.isPending}
                        >
                          {createReview.isPending ? "发布中..." : "发布评价"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">已评价</span>
                )
              ) : (
                <Button size="sm" variant="outline" onClick={() => window.location.href = getLoginUrl()}>
                  登录后评价
                </Button>
              )}
            </div>
          </div>

          <div className="divide-y divide-border">
            {reviews.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <Star className="w-10 h-10 text-muted-foreground/30 mb-2" />
                <p className="text-muted-foreground text-sm">暂无评价，成为第一个评价者</p>
              </div>
            ) : (
              reviews.map(({ review, userName }) => (
                <div key={review.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
                        {(userName || "匿名")[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{userName || "匿名徒步者"}</p>
                        <div className="flex items-center gap-2">
                          <StarRating value={review.rating} size="sm" />
                          {review.groupType && (
                            <span className="text-xs text-muted-foreground">
                              {GROUP_TYPE_LABELS[review.groupType]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {review.hikingDate && (
                        <p className="text-xs text-muted-foreground">{review.hikingDate}</p>
                      )}
                    </div>
                  </div>
                  {review.title && (
                    <p className="text-sm font-semibold text-foreground mb-1">{review.title}</p>
                  )}
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.content}</p>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        {/* Tours Tab */}
        <TabsContent value="tours" className="p-4 space-y-4 mt-0">
          {tourGroups.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <Users className="w-10 h-10 text-muted-foreground/30 mb-2" />
              <p className="text-muted-foreground text-sm">暂无推荐团队</p>
              <p className="text-xs text-muted-foreground/70 mt-1">可在找搭子模块寻找同行者</p>
            </div>
          ) : (
            tourGroups.map((tg) => (
              <div key={tg.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-foreground font-serif-sc mb-0.5">{tg.name}</h4>
                    <p className="text-xs text-muted-foreground">{tg.operator}</p>
                  </div>
                  {tg.price && (
                    <div className="text-right ml-3">
                      <p className="text-lg font-bold text-primary">¥{tg.price.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">/ 人</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {tg.departureCity && (
                    <span className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{tg.departureCity}出发
                    </span>
                  )}
                  {tg.nextDeparture && (
                    <span className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />{tg.nextDeparture}
                    </span>
                  )}
                  {tg.maxGroupSize && (
                    <span className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground flex items-center gap-1">
                      <Users className="w-3 h-3" />最多{tg.maxGroupSize}人
                    </span>
                  )}
                </div>

                {tg.description && (
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{tg.description}</p>
                )}

                {tg.includes && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-foreground mb-1.5">费用包含：</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(tg.includes as string[]).map((item, i) => (
                        <span key={i} className="text-xs bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full">
                          ✓ {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {tg.bookingUrl && (
                  <a
                    href={tg.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full bg-primary text-primary-foreground text-sm font-medium py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    立即报名
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
