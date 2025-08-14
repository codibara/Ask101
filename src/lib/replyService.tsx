// lib/replyService.ts
import type { Comment, User } from "@/types/post";

export type CommentWithAuthor = Comment & { author: User };

export async function createReply(input: {
  postId: number;
  userId: string | number;
  reply: string;
  parent_reply_id?: number | null;
}): Promise<CommentWithAuthor> {
  const res = await fetch("/api/reply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || "Failed to create reply");
  }
  return res.json();
}
