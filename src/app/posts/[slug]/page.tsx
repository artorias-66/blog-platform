"use client";

import { trpc } from "../../../trpc/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useParams } from "next/navigation";

export default function PostDetail() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const { data, isLoading, error } = trpc.posts.bySlug.useQuery({ slug });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>Not found</div>;

  return (
    <article className="prose prose-invert lg:prose-xl max-w-none mx-auto px-4 py-8">
      <h1 className="mb-2 text-4xl font-bold">{data.title}</h1>
      <div className="text-sm text-gray-400 mb-8">
        {new Date(data.createdAt).toLocaleString()}
      </div>

      {/* ✅ Wrap Markdown in a div for styling */}
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {data.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
