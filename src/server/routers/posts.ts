import { z } from "zod";
import { db } from "../db";
import { categories, posts, postsToCategories } from "../db/schema";
import { procedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { eq, desc } from "drizzle-orm";
import { slugify } from "../utils/slugify";

const basePost = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  published: z.boolean().default(false),
  categoryIds: z.array(z.number().int().positive()).default([]),
});

export const postsRouter = router({
  list: procedure
    .input(z.object({ categoryId: z.number().int().positive().optional() }).optional())
    .query(async ({ input }) => {
      if (input?.categoryId) {
        const rows = await db
          .select({
            id: posts.id,
            title: posts.title,
            slug: posts.slug,
            published: posts.published,
            createdAt: posts.createdAt,
          })
          .from(posts)
          .innerJoin(postsToCategories, eq(postsToCategories.postId, posts.id))
          .where(eq(postsToCategories.categoryId, input.categoryId))
          .orderBy(desc(posts.createdAt));
        return rows;
      }
      const rows = await db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          published: posts.published,
          createdAt: posts.createdAt,
        })
        .from(posts)
        .orderBy(desc(posts.createdAt));
      return rows;
    }),

  bySlug: procedure.input(z.object({ slug: z.string().min(1) })).query(async ({ input }) => {
    const [row] = await db.select().from(posts).where(eq(posts.slug, input.slug)).limit(1);
    if (!row) throw new Error("Post not found");
    const catRows = await db
      .select({ id: categories.id, name: categories.name, slug: categories.slug })
      .from(postsToCategories)
      .innerJoin(categories, eq(categories.id, postsToCategories.categoryId))
      .where(eq(postsToCategories.postId, row.id));
    return { ...row, categories: catRows };
  }),

  getById: procedure.input(z.object({ id: z.number().int().positive() })).query(async ({ input }) => {
    const [row] = await db.select().from(posts).where(eq(posts.id, input.id)).limit(1);
    if (!row) throw new Error("Post not found");
    const catRows = await db
      .select({ id: categories.id, name: categories.name, slug: categories.slug })
      .from(postsToCategories)
      .innerJoin(categories, eq(categories.id, postsToCategories.categoryId))
      .where(eq(postsToCategories.postId, row.id));
    return { ...row, categories: catRows };
  }),

  create: procedure.input(basePost).mutation(async ({ input }) => {
    const slug = slugify(input.title);

    const existingPost = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1);

    if (existingPost.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "A post with this title already exists.",
      });
    }

    const [created] = await db
      .insert(posts)
      .values({ title: input.title, content: input.content, published: input.published, slug })
      .returning({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        published: posts.published,
        createdAt: posts.createdAt,
      });
    if (input.categoryIds.length > 0) {
      await db.insert(postsToCategories).values(
        input.categoryIds.map((cid) => ({ postId: created.id, categoryId: cid }))
      );
    }
    return created;
  }),

  update: procedure
    .input(
      basePost.extend({ id: z.number().int().positive(), title: z.string().min(1).max(255) })
    )
    .mutation(async ({ input }) => {
      const slug = slugify(input.title);
      const [updated] = await db
        .update(posts)
        .set({ title: input.title, content: input.content, published: input.published, slug })
        .where(eq(posts.id, input.id))
        .returning({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          published: posts.published,
          createdAt: posts.createdAt,
        });

      // reset categories
      await db.delete(postsToCategories).where(eq(postsToCategories.postId, input.id));
      if (input.categoryIds.length > 0) {
        await db.insert(postsToCategories).values(
          input.categoryIds.map((cid) => ({ postId: input.id, categoryId: cid }))
        );
      }
      return updated;
    }),

  delete: procedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
    await db.delete(posts).where(eq(posts.id, input.id));
    return { success: true } as const;
  }),
});
