import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getTrails,
  getTrailBySlug,
  getTrailById,
  getReviewsByTrailId,
  createReview,
  getUserReviewForTrail,
  getTourGroupsByTrailId,
  getBuddyPosts,
  createBuddyPost,
} from "./db";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ===== Trail Routes =====
  trails: router({
    list: publicProcedure
      .input(z.object({
        difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
        search: z.string().optional(),
        region: z.string().optional(),
        featured: z.boolean().optional(),
      }).optional())
      .query(async ({ input }) => {
        return getTrails(input);
      }),

    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const trail = await getTrailBySlug(input.slug);
        if (!trail) throw new TRPCError({ code: "NOT_FOUND", message: "线路不存在" });
        return trail;
      }),

    byId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const trail = await getTrailById(input.id);
        if (!trail) throw new TRPCError({ code: "NOT_FOUND", message: "线路不存在" });
        return trail;
      }),

    tourGroups: publicProcedure
      .input(z.object({ trailId: z.number() }))
      .query(async ({ input }) => {
        return getTourGroupsByTrailId(input.trailId);
      }),
  }),

  // ===== Review Routes =====
  reviews: router({
    byTrail: publicProcedure
      .input(z.object({ trailId: z.number() }))
      .query(async ({ input }) => {
        return getReviewsByTrailId(input.trailId);
      }),

    create: protectedProcedure
      .input(z.object({
        trailId: z.number(),
        rating: z.number().min(1).max(5),
        title: z.string().optional(),
        content: z.string().min(10, "评价内容至少10个字"),
        hikingDate: z.string().optional(),
        groupType: z.enum(["solo", "couple", "friends", "family", "group"]).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const existing = await getUserReviewForTrail(ctx.user.id, input.trailId);
        if (existing) throw new TRPCError({ code: "CONFLICT", message: "您已评价过该线路" });
        await createReview({ ...input, userId: ctx.user.id });
        return { success: true };
      }),

    myReview: protectedProcedure
      .input(z.object({ trailId: z.number() }))
      .query(async ({ input, ctx }) => {
        return getUserReviewForTrail(ctx.user.id, input.trailId);
      }),
  }),

  // ===== Buddy Post Routes =====
  buddy: router({
    list: publicProcedure
      .input(z.object({
        trailId: z.number().optional(),
        status: z.enum(["open", "full", "closed"]).optional(),
      }).optional())
      .query(async ({ input }) => {
        return getBuddyPosts(input);
      }),

    create: protectedProcedure
      .input(z.object({
        trailId: z.number().optional(),
        title: z.string().min(5, "标题至少5个字"),
        content: z.string().min(20, "内容至少20个字"),
        departureDate: z.string(),
        departureCity: z.string().optional(),
        targetCount: z.number().min(2).max(50),
        budget: z.string().optional(),
        requirements: z.string().optional(),
        contactInfo: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        await createBuddyPost({ ...input, userId: ctx.user.id });
        return { success: true };
      }),
  }),

  // ===== AI Recommendation Route =====
  ai: router({
    recommend: publicProcedure
      .input(z.object({
        messages: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })),
      }))
      .mutation(async ({ input }) => {
        // Get all trails for context
        const allTrails = await getTrails();
        const trailsContext = allTrails.map(t => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
          difficulty: t.difficulty,
          region: t.region,
          duration: t.duration,
          bestSeason: t.bestSeason,
          costMin: t.costMin,
          costMax: t.costMax,
          avgRating: t.avgRating,
          summary: t.summary,
          highlights: t.highlights,
        }));

        const systemPrompt = `你是一位专业的徒步向导助手，名叫"山行"。你的任务是帮助用户找到最适合他们的徒步线路。

当前数据库中的线路信息（JSON格式）：
${JSON.stringify(trailsContext, null, 2)}

难度说明：
- beginner（新手）：适合零基础或少量徒步经验者
- intermediate（中阶）：需要一定体能和徒步经验
- advanced（高手）：需要丰富的高山/长距离徒步经验

你的对话策略：
1. 首先友好地问候，引导用户回答以下关键问题（可以分步骤询问，不要一次全问）：
   - 徒步经验（新手/中阶/高手）
   - 计划徒步时长（1天/2-3天/一周以上）
   - 目的地或地区偏好（华东/西南/西北/西藏等）
   - 出发城市
   - 预算范围（人均）
   - 同行人数
   - 是否想报团或找搭子

2. 收集足够信息后，推荐2-3条最匹配的线路，格式如下：
   - 每条线路包含：线路名称、匹配度（百分比）、推荐理由（2-3句话）
   - 使用 [TRAIL_SLUG:xxx] 标记线路slug，供前端识别并跳转
   - 例如：**西湖环湖步道** [TRAIL_SLUG:xihu-lake-trail] - 匹配度：95%

3. 保持对话自然流畅，用中文回复，语气亲切专业
4. 如果用户直接问某条线路的信息，直接回答，并用 [TRAIL_SLUG:xxx] 标记
5. 推荐时要说明匹配理由，让用户感受到个性化推荐

请根据用户的对话历史，给出最合适的回复。`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            ...input.messages,
          ],
        });

        const rawContent = response.choices[0]?.message?.content;
        const content = typeof rawContent === "string" ? rawContent : (rawContent ? JSON.stringify(rawContent) : "抱歉，我暂时无法回答，请稍后再试。");
        return { content };
      }),
  }),
});

export type AppRouter = typeof appRouter;
