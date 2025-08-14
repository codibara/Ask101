// app/post/[postId]/page.tsx
import PostDetailClient from "./PostDetailClient";

export default async function PostPage({ 
  params 
}: { 
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Fetch post + comments (with author) on the server
  const [postRes, commentsRes] = await Promise.all([
    fetch(`${baseUrl}/api/posts?id=${postId}`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/comments?postId=${postId}`, { cache: "no-store" }),
  ]);

  if (!postRes.ok) {
    return <div className="p-10 text-red-500">Post not found</div>;
  }

  const post = await postRes.json();
  const comments = await commentsRes.json(); // array of CommentWithAuthor

  return <PostDetailClient post={post} comments={comments} />;
}
