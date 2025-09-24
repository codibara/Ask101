// app/myposts/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import {
  posts as postsTable,
  users as usersTable,
  reply as repliesTable,
  votes as votesTable,
} from "@/db/schema/tables";
import { and, eq, isNull, count, desc } from "drizzle-orm";
import PostList from "@/app/postList";

export default async function MyPostsPage() {
  // @ts-expect-error: type error
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);
  if (!userId) redirect("/login");

  const raw = await db
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
      // only top-level comments
      commentCount: count(repliesTable.id),
      userVoteId: votesTable.id,
      userVoteChoice: votesTable.vote,
    })
    .from(postsTable)
    .innerJoin(usersTable, eq(postsTable.authorId, usersTable.id))
    // count top-level replies
    .leftJoin(
      repliesTable,
      and(eq(repliesTable.postId, postsTable.id), isNull(repliesTable.parentReplyId))
    )
    // (optional) join votes just to provide userVoteId; not used on "My posts" tab
    .leftJoin(
      votesTable,
      and(
        eq(votesTable.postId, postsTable.id),
        eq(votesTable.userId, userId)   // <= important
      )
    )
    // only my posts
    .where(eq(postsTable.authorId, userId))
    .groupBy(postsTable.id, usersTable.id, votesTable.id)
    .orderBy(
            desc(postsTable.createdAt),   // newest first
            desc(postsTable.id)           // tie-breaker for same timestamp
          );

  const formatYMD = (d: Date | string | null) =>
    d ? (d instanceof Date ? d.toISOString().split("T")[0] : new Date(d).toISOString().split("T")[0]) : null;

  const rows = raw.map(r => ({
    post: {
      ...r.post,
      created_at: formatYMD(r.post.created_at)!,
      ended_at: formatYMD(r.post.ended_at),
    },
    author: r.author,
    commentCount: r.commentCount,
    userVoteId: r.userVoteId ?? null,
    userVoteChoice: r.userVoteChoice ?? null,
  }));

  return (
    <main className="min-h-[calc(100svh-160px)] px-5 pb-[88px] md:px-26  md:py-5">
      <PostList rows={rows} isMyPost={true}/>
    </main>
  );
}
