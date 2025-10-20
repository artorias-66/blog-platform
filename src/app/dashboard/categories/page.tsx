"use client";
import Link from "next/link";
import { trpc } from "../../../trpc/client";

export default function CategoriesDashboardPage() {
  const { data: categories, isLoading, error } = trpc.categories.list.useQuery();
  const deleteCategory = trpc.categories.delete.useMutation();

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await deleteCategory.mutateAsync({ id });
      // The query will automatically refetch due to React Query
    }
  };

  if (isLoading) return <div>Loading categories...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Categories</h1>
        <Link href="/dashboard/categories/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          New Category
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories?.length === 0 ? (
          <p className="text-gray-500">
            No categories yet. Create your first category!
          </p>
        ) : (
          categories?.map((category) => (
            <div key={category.id} className="card">
              <div className="flex-1">
                <h3 className="font-semibold">{category.name}</h3>
                <div className="text-sm text-gray-400">
                  Slug: {category.slug}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Link
                  href={`/dashboard/categories/${category.id}/edit`}
                  className="text-green-400 hover:text-green-600 text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-400 hover:text-red-600 text-sm"
                  disabled={deleteCategory.isPending}
                >
                  {deleteCategory.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
