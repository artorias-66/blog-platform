"use client";
import Link from "next/link";
import { trpc } from "../../trpc/client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function PostsPage() {
  const params = useSearchParams();
  const router = useRouter();
  const categoryId = params.get("categoryId");
  const [selectedCategory, setSelectedCategory] = useState(categoryId ? Number(categoryId) : "");
  
  const { data: postsData, isLoading, error } = trpc.posts.list.useQuery(
    selectedCategory ? { categoryId: Number(selectedCategory) } : undefined
  );
  const posts = Array.isArray(postsData) ? postsData : [];
  const { data: categoriesData } = trpc.categories.list.useQuery();
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      router.push(`/posts?categoryId=${categoryId}`);
    } else {
      router.push("/posts");
    }
  };

  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">All Posts</h1>
        <Link href="/dashboard/posts/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          New Post
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        <label htmlFor="category-filter" className="text-sm font-medium">Filter by category:</label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="">All Categories</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts?.length === 0 ? (
          <p className="text-gray-500">No posts found.</p>
        ) : (
          posts?.map((p) => (
            <article key={p.id} className="card">
              <Link href={`/posts/${p.slug}`} className="block">
                <h2 className="text-xl font-semibold mb-2 hover:text-blue-400">
                  {p.title}
                </h2>
                <div className="text-sm text-gray-400 mb-2">
                  {new Date(p.createdAt).toLocaleDateString()} •{" "}
                  {p.published ? "Published" : "Draft"}
                </div>
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
