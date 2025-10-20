"use client";
import Link from "next/link";
import { trpc } from "../../../trpc/client";
import { useQueryClient } from "@tanstack/react-query";

export default function PostsDashboardPage() {
  const queryClient = useQueryClient();
  const { data: postsData, isLoading, error } = trpc.posts.list.useQuery();
  const posts = Array.isArray(postsData) ? postsData : [];
  const deletePost = trpc.posts.delete.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [['posts', 'list']] }); // Invalidate the list query to refetch posts
    },
  });

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deletePost.mutateAsync({ id });
    }
  };

  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Posts</h1>
        <Link href="/dashboard/posts/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          New Post
        </Link>
      </div>

      <div className="space-y-4">
        {posts?.length === 0 ? (
          <p className="text-gray-500">No posts yet. Create your first post!</p>
        ) : (
          posts?.map((post) => (
            <div key={post.id} className="border rounded-lg p-4 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">{post.title}</h3>
                <div className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()} • {post.published ? "Published" : "Draft"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/posts/${post.slug}`} className="text-blue-600 hover:text-blue-800 text-sm">
                  View
                </Link>
                <Link href={`/dashboard/posts/${post.id}/edit`} className="text-green-600 hover:text-green-800 text-sm">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                  disabled={deletePost.isPending}
                >
                  {deletePost.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
