// lib/posts.ts (server)
import { db } from "@/db";
import { and, eq, isNull, count, desc, lt, or } from "drizzle-orm";
import { posts as postsTable, users as usersTable, votes as votesTable, reply as repliesTable } from "@/db/schema/tables";
import type { PostListRow } from "@/app/page";

export type PostsCursor = { createdAt: Date; id: number } | null;

export async function getPostsPage({
  limit,
  cursor,        // { createdAt, id } from the last item of previous page
  userId,        // -1 (guest) or actual user id
}: {
  limit: number;
  cursor: PostsCursor;
  userId: number;
}): Promise<{ items: PostListRow[]; nextCursor: PostsCursor }> {

  const whereKeyset = cursor
    ? or(
        lt(postsTable.createdAt, new Date(cursor.createdAt)),
        and(
          eq(postsTable.createdAt, new Date(cursor.createdAt)),
          lt(postsTable.id, cursor.id)
        )
      )
    : undefined;

  // Build the base
  const basePosts = db
    .select({
      post: {
        id: postsTable.id,
        title: postsTable.title,
        content: postsTable.content,
        author_id: postsTable.authorId,
        created_at: postsTable.createdAt,
        option_a: postsTable.optionA,
        option_b: postsTable.optionB,
        votes_a: postsTable.votesA,
        votes_b: postsTable.votesB,
        view_count: postsTable.viewCount,
        ended_at: postsTable.endedAt,
        is_end_vote: postsTable.isEndVote,
      },
      author: {
        id: usersTable.id,
        displayName: usersTable.displayName,
        sex: usersTable.sex,
        mbti: usersTable.mbti,
        birthYear: usersTable.birthYear,
        job: usersTable.job,
        age: usersTable.age,
      },
      commentCount: count(repliesTable.id),
      userVoteId: votesTable.id,
    })
    .from(postsTable)
    .innerJoin(usersTable, eq(postsTable.authorId, usersTable.id))
    .leftJoin(
      votesTable,
      and(eq(votesTable.postId, postsTable.id), eq(votesTable.userId, userId || -1))
    )
    .leftJoin(
      repliesTable,
      and(eq(repliesTable.postId, postsTable.id), isNull(repliesTable.parentReplyId))
    )
    .groupBy(postsTable.id, usersTable.id, votesTable.id)
    .orderBy(desc(postsTable.createdAt), desc(postsTable.id))
    .limit(limit + 1); // fetch one extra to know if there's a next page

  const rowsRaw = whereKeyset ? await basePosts.where(whereKeyset) : await basePosts;

  // format for client + trim to `limit`
  const fmt = (date: Date | string | null) =>
    date ? new Date(date).toISOString().split("T")[0] : null;

  const trimmed = rowsRaw.slice(0, limit);
  const items: PostListRow[] = trimmed.map((r) => ({
    post: {
      ...r.post,
      created_at: fmt(r.post.created_at)!,
      ended_at: fmt(r.post.ended_at),
    },
    author: r.author,
    userVoteId: r.userVoteId,
    commentCount: r.commentCount,
  }));

  const hasMore = rowsRaw.length > limit;
  const last = trimmed[trimmed.length - 1];
  const nextCursor = hasMore
    ? { createdAt: last.post.created_at, id: last.post.id }
    : null;

  return { items, nextCursor };
}
