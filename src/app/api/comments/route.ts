// app/api/comments/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { reply, users } from "@/db/schema/tables";
import { and, eq } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postIdParam = searchParams.get("postId"); // filter by post

  const q = db
    .select({
      id: reply.id,
      post_id: reply.postId,
      user_id: reply.userId,
      reply: reply.reply,
      parent_reply_id: reply.parentReplyId,
      is_deleted: reply.isDeleted,
      created_at: reply.createdAt,

      // author (alias to match your User interface)
      author_userId: users.id,
      author_name: users.name,
      author_email: users.email,
      author_display_name: users.displayName,
      author_age: users.age,
      author_sex: users.sex,
      author_mbti: users.mbti,
      author_job: users.job,
    })
    .from(reply)
    .innerJoin(users, eq(reply.userId, users.id))
    .where(postIdParam ? eq(reply.postId, Number(postIdParam)) : undefined);

  const rows = await q;

  const data = rows.map(r => ({
    id: r.id,
    post_id: r.post_id,
    user_id: String(r.user_id),
    reply: r.reply,
    parent_reply_id: r.parent_reply_id,
    is_deleted: r.is_deleted,
    created_at: r.created_at,
    author: {
      userId: String(r.author_userId),
      name: r.author_name,
      email: r.author_email,
      display_name: r.author_display_name,
      sex: r.author_sex,
      mbti: r.author_mbti,
      job: r.author_job,
      age: r.author_age,
    },
  }));

  return NextResponse.json(data);
}
