import { MapPin, Clock, TrendingUp, Star, ChevronRight } from "lucide-react";
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS, DIFFICULTY_ICON } from "@/types/hiking";
import type { Trail } from "../../../drizzle/schema";

interface TrailCardProps {
  trail: Trail;
  onClick: (slug: string) => void;
  compact?: boolean;
}

export function TrailCard({ trail, onClick, compact = false }: TrailCardProps) {
  const diffLabel = DIFFICULTY_LABELS[trail.difficulty];
  const diffColor = DIFFICULTY_COLORS[trail.difficulty];
  const diffIcon = DIFFICULTY_ICON[trail.difficulty];

  return (
    <div
      onClick={() => onClick(trail.slug)}
      className="group bg-card border border-border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/30"
    >
      {/* Cover Image */}
      {!compact && trail.coverImage && (
        <div className="relative h-44 overflow-hidden">
          <img
            src={trail.coverImage}
            alt={trail.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {trail.featured && (
            <div className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-xs font-semibold px-2.5 py-1 rounded-full">
              ✦ 精选推荐
            </div>
          )}
          <div className="absolute bottom-3 left-3">
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${diffColor} bg-white/90`}>
              {diffIcon} {diffLabel}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-serif-sc font-semibold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {trail.name}
          </h3>
          {compact && (
            <span className={`shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${diffColor}`}>
              {diffIcon} {diffLabel}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {trail.region}{trail.province ? ` · ${trail.province}` : ""}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {trail.duration}
          </span>
          {trail.distance && (
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {trail.distance}
            </span>
          )}
        </div>

        {!compact && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
            {trail.summary}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3 h-3 ${s <= Math.round(trail.avgRating || 0) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {trail.avgRating?.toFixed(1)} ({trail.reviewCount})
            </span>
          </div>
          {trail.costMin && (
            <span className="text-xs font-medium text-primary">
              ¥{trail.costMin.toLocaleString()}起
            </span>
          )}
        </div>

        {!compact && (
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">最佳季节：{trail.bestSeason.split("，")[0]}</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        )}
      </div>
    </div>
  );
}
