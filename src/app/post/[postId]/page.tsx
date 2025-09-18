// app/post/[postId]/page.tsx
import { headers } from "next/headers";
import PostDetailClient from "./PostDetailClient";

// Reuse the same nested row type you use for lists
export type PostRow = {
  post: {
    id: number;
    title: string;
    content: string;
    author_id: number;
    created_at: string;          // "YYYY-MM-DD"
    option_a: string;
    option_b: string;
    votes_a: number;
    votes_b: number;
    view_count: number;
    ended_at: string | null;     // "YYYY-MM-DD" | null
    is_end_vote: boolean | null;
  };
  author: {
    id: number;
    displayName: string | null;  // note: camelCase per API
    sex: string | null;
    mbti: string | null;
    birthYear: number | null;
    job: string | null;
    age: string | null;
  };
  commentCount: number;
  userVoteId: number | null;
};

type CommentWithAuthor = {
  id: number;
  post_id: number;
  user_id: string;
  reply: string;
  parent_reply_id: string | null;
  is_deleted: boolean;
  created_at: string; // you can keep "YYYY-MM-DD" in your comments API too
  author: {
    userId: number;
    display_name: string | null; // keep whatever your comments API returns
    sex: string | null;
    mbti: string | null;
    age: string | null;
    job: string | null;
  };
};

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // forward cookies so next-auth session is visible to the API (good habit)
  const cookie = (await headers()).get("cookie") ?? "";

  const [postRes, commentsRes] = await Promise.all([
    fetch(`${baseUrl}/api/posts?id=${postId}`, {
      cache: "no-store",
      headers: { cookie },
    }),
    fetch(`${baseUrl}/api/comments?postId=${postId}`, {
      cache: "no-store",
      headers: { cookie },
    }),
  ]);

  if (!postRes.ok) {
    return <div className="p-10 text-red-500">Post not found</div>;
  }

  const post = (await postRes.json()) as PostRow;
  const comments = (await commentsRes.json()) as CommentWithAuthor[];

  return <PostDetailClient post={post} comments={comments} />;
}
