import { z } from "zod";
import { db } from "../db";
import { categories } from "../db/schema";
import { procedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { eq, desc } from "drizzle-orm";
import { slugify } from "../utils/slugify";

const baseCategory = z.object({
  name: z.string().min(1).max(120),
  description: z.string().optional(),
});

export const categoriesRouter = router({
  list: procedure.query(async () => {
    const rows = await db
      .select({ id: categories.id, name: categories.name, slug: categories.slug })
      .from(categories)
      .orderBy(desc(categories.createdAt));
    return rows;
  }),
  create: procedure.input(baseCategory).mutation(async ({ input }) => {
    const slug = slugify(input.name);

    const existingCategory = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);

    if (existingCategory.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "A category with this name already exists.",
      });
    }

    const [created] = await db
      .insert(categories)
      .values({ name: input.name, description: input.description, slug })
      .returning({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      });
    return created;
  }),
  update: procedure
    .input(baseCategory.extend({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      const slug = slugify(input.name);
      const [updated] = await db
        .update(categories)
        .set({ name: input.name, description: input.description, slug })
        .where(eq(categories.id, input.id))
        .returning({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        });
      return updated;
    }),
  delete: procedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
    await db.delete(categories).where(eq(categories.id, input.id));
    return { success: true } as const;
  }),
  getById: procedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, input.id));

      if (!category) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found.",
        });
      }
      return category;
    }),
});
