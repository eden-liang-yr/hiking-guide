import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module
vi.mock("./db", () => ({
  getTrails: vi.fn().mockResolvedValue([
    {
      id: 1,
      name: "西湖环湖步道",
      slug: "xihu-lake-trail",
      difficulty: "beginner",
      region: "华东",
      province: "浙江",
      duration: "1天",
      distance: "15km",
      elevation: "最高海拔200m",
      bestSeason: "全年皆宜",
      coverImage: null,
      summary: "测试摘要",
      highlights: ["断桥残雪"],
      equipment: ["运动鞋"],
      transportation: "地铁",
      accommodation: "湖边酒店",
      costMin: 100,
      costMax: 300,
      pros: ["路面平坦"],
      cons: ["节假日人多"],
      culturalBackground: "西湖文化",
      tips: "早起出发",
      avgRating: 4.5,
      reviewCount: 128,
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  getTrailBySlug: vi.fn().mockImplementation(async (slug: string) => {
    if (slug === "xihu-lake-trail") {
      return {
        id: 1,
        name: "西湖环湖步道",
        slug: "xihu-lake-trail",
        difficulty: "beginner",
        region: "华东",
        province: "浙江",
        duration: "1天",
        distance: "15km",
        elevation: "最高海拔200m",
        bestSeason: "全年皆宜",
        coverImage: null,
        summary: "测试摘要",
        highlights: ["断桥残雪"],
        equipment: ["运动鞋"],
        transportation: "地铁",
        accommodation: "湖边酒店",
        costMin: 100,
        costMax: 300,
        pros: ["路面平坦"],
        cons: ["节假日人多"],
        culturalBackground: "西湖文化",
        tips: "早起出发",
        avgRating: 4.5,
        reviewCount: 128,
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    return undefined;
  }),
  getTrailById: vi.fn().mockResolvedValue(undefined),
  getReviewsByTrailId: vi.fn().mockResolvedValue([]),
  createReview: vi.fn().mockResolvedValue(undefined),
  getUserReviewForTrail: vi.fn().mockResolvedValue(undefined),
  getTourGroupsByTrailId: vi.fn().mockResolvedValue([]),
  getBuddyPosts: vi.fn().mockResolvedValue([]),
  createBuddyPost: vi.fn().mockResolvedValue(undefined),
}));

function createPublicCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createAuthCtx(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "测试用户",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("trails router", () => {
  it("list returns trails array", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.trails.list({});
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].name).toBe("西湖环湖步道");
  });

  it("bySlug returns correct trail", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const trail = await caller.trails.bySlug({ slug: "xihu-lake-trail" });
    expect(trail.name).toBe("西湖环湖步道");
    expect(trail.difficulty).toBe("beginner");
  });

  it("bySlug throws NOT_FOUND for unknown slug", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    await expect(caller.trails.bySlug({ slug: "nonexistent" })).rejects.toThrow("线路不存在");
  });

  it("tourGroups returns array", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const groups = await caller.trails.tourGroups({ trailId: 1 });
    expect(Array.isArray(groups)).toBe(true);
  });
});

describe("reviews router", () => {
  it("byTrail returns reviews array", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const reviews = await caller.reviews.byTrail({ trailId: 1 });
    expect(Array.isArray(reviews)).toBe(true);
  });

  it("create requires authentication", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    await expect(
      caller.reviews.create({
        trailId: 1,
        rating: 5,
        content: "这是一条很好的线路，强烈推荐！",
      })
    ).rejects.toThrow();
  });

  it("create succeeds with auth", async () => {
    const caller = appRouter.createCaller(createAuthCtx());
    const result = await caller.reviews.create({
      trailId: 1,
      rating: 5,
      content: "这是一条很好的线路，强烈推荐！",
    });
    expect(result.success).toBe(true);
  });
});

describe("buddy router", () => {
  it("list returns posts array", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const posts = await caller.buddy.list({ status: "open" });
    expect(Array.isArray(posts)).toBe(true);
  });

  it("create requires authentication", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    await expect(
      caller.buddy.create({
        title: "招募徒步搭子",
        content: "计划8月出发，寻找有经验的徒步伙伴同行。",
        departureDate: "2025年8月10日",
        targetCount: 4,
      })
    ).rejects.toThrow();
  });

  it("create succeeds with auth", async () => {
    const caller = appRouter.createCaller(createAuthCtx());
    const result = await caller.buddy.create({
      title: "招募徒步搭子",
      content: "计划8月出发，寻找有经验的徒步伙伴同行。",
      departureDate: "2025年8月10日",
      targetCount: 4,
    });
    expect(result.success).toBe(true);
  });
});

describe("auth router", () => {
  it("me returns null for unauthenticated user", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const user = await caller.auth.me();
    expect(user).toBeNull();
  });

  it("me returns user for authenticated user", async () => {
    const caller = appRouter.createCaller(createAuthCtx());
    const user = await caller.auth.me();
    expect(user?.name).toBe("测试用户");
  });
});
