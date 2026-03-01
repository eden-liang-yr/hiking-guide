export type Difficulty = "beginner" | "intermediate" | "advanced";

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: "新手",
  intermediate: "中阶",
  advanced: "高手",
};

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  beginner: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  intermediate: "bg-amber-50 text-amber-700 border border-amber-200",
  advanced: "bg-rose-50 text-rose-700 border border-rose-200",
};

export const DIFFICULTY_ICON: Record<Difficulty, string> = {
  beginner: "🌿",
  intermediate: "⛰️",
  advanced: "🏔️",
};

export const GROUP_TYPE_LABELS: Record<string, string> = {
  solo: "独行侠",
  couple: "情侣",
  friends: "朋友",
  family: "家庭",
  group: "团队",
};

export const REGION_OPTIONS = [
  "华东", "华中", "华南", "华北", "西南", "西北", "东北", "西藏",
];
