"use client";
import Link from "next/link";
import { trpc } from "../trpc/client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function PostsList() {
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">All Posts</h1>
        <Link href="/dashboard/posts/new" className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors">
          New Post
        </Link>
      </div>
      
      <div className="flex items-center gap-4 mb-8">
        <label htmlFor="category-filter" className="text-base font-medium text-gray-300">Filter by category:</label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="border border-gray-600 bg-gray-800 text-white rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
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
          <p className="text-gray-500 text-lg">No posts found.</p>
        ) : (
          posts?.map((p) => (
            <article key={p.id} className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Link href={`/posts/${p.slug}`} className="block">
                <h2 className="text-2xl font-bold mb-3 text-white hover:text-blue-400 transition-colors">
                  {p.title}
                </h2>
                <div className="text-sm text-gray-400">
                  {new Date(p.createdAt).toLocaleDateString()} •{" "}
                  <span className={p.published ? "text-green-400" : "text-yellow-400"}>
                    {p.published ? "Published" : "Draft"}
                  </span>
                </div>
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
