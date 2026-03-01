import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  float,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// 徒步线路表
export const trails = mysqlTable("trails", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  difficulty: mysqlEnum("difficulty", ["beginner", "intermediate", "advanced"]).notNull(),
  region: varchar("region", { length: 100 }).notNull(),
  province: varchar("province", { length: 50 }),
  duration: varchar("duration", { length: 100 }).notNull(), // e.g. "3天2夜"
  distance: varchar("distance", { length: 50 }), // e.g. "45km"
  elevation: varchar("elevation", { length: 100 }), // e.g. "最高海拔3200m"
  bestSeason: varchar("bestSeason", { length: 200 }).notNull(),
  coverImage: text("coverImage"),
  summary: text("summary").notNull(),
  highlights: json("highlights").$type<string[]>().notNull(), // 线路亮点
  equipment: json("equipment").$type<string[]>().notNull(), // 推荐装备
  transportation: text("transportation").notNull(), // 交通方式
  accommodation: text("accommodation").notNull(), // 住宿建议
  costMin: int("costMin"), // 最低费用（元）
  costMax: int("costMax"), // 最高费用（元）
  pros: json("pros").$type<string[]>().notNull(), // 优点
  cons: json("cons").$type<string[]>().notNull(), // 缺点
  culturalBackground: text("culturalBackground"), // 文化历史背景
  tips: text("tips"), // 注意事项
  avgRating: float("avgRating").default(0),
  reviewCount: int("reviewCount").default(0),
  featured: boolean("featured").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Trail = typeof trails.$inferSelect;
export type InsertTrail = typeof trails.$inferInsert;

// 报团推荐表
export const tourGroups = mysqlTable("tour_groups", {
  id: int("id").autoincrement().primaryKey(),
  trailId: int("trailId").notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  operator: varchar("operator", { length: 200 }).notNull(),
  price: int("price"), // 人均价格（元）
  duration: varchar("duration", { length: 100 }),
  departureCity: varchar("departureCity", { length: 100 }),
  nextDeparture: varchar("nextDeparture", { length: 100 }),
  maxGroupSize: int("maxGroupSize"),
  includes: json("includes").$type<string[]>(), // 费用包含
  bookingUrl: text("bookingUrl"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TourGroup = typeof tourGroups.$inferSelect;
export type InsertTourGroup = typeof tourGroups.$inferInsert;

// 用户评价表
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  trailId: int("trailId").notNull(),
  userId: int("userId").notNull(),
  rating: int("rating").notNull(), // 1-5
  title: varchar("title", { length: 200 }),
  content: text("content").notNull(),
  hikingDate: varchar("hikingDate", { length: 50 }), // e.g. "2024年10月"
  groupType: mysqlEnum("groupType", ["solo", "couple", "friends", "family", "group"]),
  helpfulCount: int("helpfulCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

// 找搭子帖子表
export const buddyPosts = mysqlTable("buddy_posts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  trailId: int("trailId"),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  departureDate: varchar("departureDate", { length: 100 }).notNull(),
  departureCity: varchar("departureCity", { length: 100 }),
  currentCount: int("currentCount").default(1).notNull(),
  targetCount: int("targetCount").notNull(),
  budget: varchar("budget", { length: 100 }),
  requirements: text("requirements"),
  contactInfo: varchar("contactInfo", { length: 200 }),
  status: mysqlEnum("status", ["open", "full", "closed"]).default("open").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BuddyPost = typeof buddyPosts.$inferSelect;
export type InsertBuddyPost = typeof buddyPosts.$inferInsert;
