"use client";
import { trpc } from "../../../trpc/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useParams } from "next/navigation";

export default function PostDetail() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const { data, isLoading, error } = trpc.posts.bySlug.useQuery({ slug });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>Not found</div>;

  return (
    <article className="prose max-w-none">
      <h1>{data.title}</h1>
      <div className="text-sm text-gray-500 mb-4">
        {new Date(data.createdAt).toLocaleString()}
      </div>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.content}</ReactMarkdown>
    </article>
  );
}
