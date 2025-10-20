"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { trpc } from "../../../../../trpc/client";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = Number(params.id);

  const { data: category, isLoading, error } = trpc.categories.getById.useQuery(
    { id: categoryId },
    { enabled: !!categoryId }
  );
  const updateCategory = trpc.categories.update.useMutation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || "");
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCategory.mutateAsync({ id: categoryId, name, description });
    router.push("/dashboard/categories");
    router.refresh();
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Category Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateCategory.isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {updateCategory.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
