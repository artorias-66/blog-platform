import { pgTable, serial, text, timestamp, boolean, varchar, index } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    content: text("content").notNull(),
    published: boolean("published").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: false }).notNull().default(sql`now()`),
    updatedAt: timestamp("updated_at", { withTimezone: false }).notNull().default(sql`now()`),
  },
  (t) => ({
    slugIdx: index("posts_slug_idx").on(t.slug),
  })
);

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: false }).notNull().default(sql`now()`),
    updatedAt: timestamp("updated_at", { withTimezone: false }).notNull().default(sql`now()`),
  },
  (t) => ({
    slugIdx: index("categories_slug_idx").on(t.slug),
  })
);

export const postsToCategories = pgTable("posts_to_categories", {
  postId: serial("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  categoryId: serial("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
});

export const postsRelations = relations(posts, ({ many }) => ({
  categories: many(postsToCategories),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(postsToCategories),
}));

export const postsToCategoriesRelations = relations(postsToCategories, ({ one }) => ({
  post: one(posts, {
    fields: [postsToCategories.postId],
    references: [posts.id],
  }),
  category: one(categories, {
    fields: [postsToCategories.categoryId],
    references: [categories.id],
  }),
}));



