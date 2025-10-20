import { Suspense } from "react";
import PostsList from "../../components/PostsList";

export default function PostsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostsList />
    </Suspense>
  );
}
