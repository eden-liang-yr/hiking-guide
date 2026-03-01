import { eq, like, and, desc, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, trails, reviews, buddyPosts, tourGroups, type InsertReview, type InsertBuddyPost } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;

    for (const field of textFields) {
      const value = user[field];
      if (value === undefined) continue;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    }

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== Trail Queries =====
export async function getTrails(opts?: {
  difficulty?: "beginner" | "intermediate" | "advanced";
  search?: string;
  region?: string;
  featured?: boolean;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  if (opts?.difficulty) conditions.push(eq(trails.difficulty, opts.difficulty));
  if (opts?.region) conditions.push(eq(trails.region, opts.region));
  if (opts?.featured) conditions.push(eq(trails.featured, true));
  if (opts?.search) {
    conditions.push(
      or(
        like(trails.name, `%${opts.search}%`),
        like(trails.region, `%${opts.search}%`),
        like(trails.summary, `%${opts.search}%`)
      )
    );
  }

  const query = db.select().from(trails);
  if (conditions.length > 0) {
    return query.where(and(...conditions)).orderBy(desc(trails.avgRating));
  }
  return query.orderBy(desc(trails.avgRating));
}

export async function getTrailBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(trails).where(eq(trails.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getTrailById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(trails).where(eq(trails.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== Review Queries =====
export async function getReviewsByTrailId(trailId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      review: reviews,
      userName: users.name,
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.trailId, trailId))
    .orderBy(desc(reviews.createdAt));
}

export async function createReview(data: InsertReview) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(reviews).values(data);
  // Update trail avg rating
  const allReviews = await db.select().from(reviews).where(eq(reviews.trailId, data.trailId));
  const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
  await db.update(trails)
    .set({ avgRating: avg, reviewCount: allReviews.length })
    .where(eq(trails.id, data.trailId));
}

export async function getUserReviewForTrail(userId: number, trailId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(reviews)
    .where(and(eq(reviews.userId, userId), eq(reviews.trailId, trailId)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== Tour Group Queries =====
export async function getTourGroupsByTrailId(trailId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tourGroups).where(eq(tourGroups.trailId, trailId));
}

// ===== Buddy Post Queries =====
export async function getBuddyPosts(opts?: { trailId?: number; status?: "open" | "full" | "closed" }) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  if (opts?.trailId) conditions.push(eq(buddyPosts.trailId, opts.trailId));
  if (opts?.status) conditions.push(eq(buddyPosts.status, opts.status));

  const query = db
    .select({
      post: buddyPosts,
      userName: users.name,
      trailName: trails.name,
      trailSlug: trails.slug,
      trailDifficulty: trails.difficulty,
    })
    .from(buddyPosts)
    .leftJoin(users, eq(buddyPosts.userId, users.id))
    .leftJoin(trails, eq(buddyPosts.trailId, trails.id))
    .orderBy(desc(buddyPosts.createdAt));

  if (conditions.length > 0) {
    return query.where(and(...conditions));
  }
  return query;
}

export async function createBuddyPost(data: InsertBuddyPost) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(buddyPosts).values(data);
}

export async function getBuddyPostById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select({
      post: buddyPosts,
      userName: users.name,
      trailName: trails.name,
      trailSlug: trails.slug,
    })
    .from(buddyPosts)
    .leftJoin(users, eq(buddyPosts.userId, users.id))
    .leftJoin(trails, eq(buddyPosts.trailId, trails.id))
    .where(eq(buddyPosts.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}
