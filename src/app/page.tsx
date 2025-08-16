import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { 
  posts as postsTable, 
  users as usersTable, 
  votes as votesTable, 
  reply as repliesTable } from "@/db/schema/tables";
import { and, eq, isNull, count, desc } from "drizzle-orm";
import PostList from "@/app/postList";

export type PostListRow = {
  post: {
    id: number;
    title: string;
    content: string;
    author_id: number;
    created_at: string;            // normalize to string for client
    option_a: string;
    option_b: string;
    votes_a: number;
    votes_b: number;
    ended_at: string | null;
    is_end_vote: boolean | null;       // normalize to string|null
  };
  author: {
    id: number;
    displayName: string | null;
    sex: string | null;
    mbti: string | null;
    birthYear: number | null;
    job: string | null;
    age: string | null;
  };
  commentCount: number,
  userVoteId: number | null;
};

export default async function Home() {
  // @ts-expect-error: type error
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id) || -1;  // or null if not logged in
  
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
        ended_at: postsTable.endedAt,
        is_end_vote: postsTable.isEndVote
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
      userVoteId: votesTable.id // or your subquery as sql<number|null>...
    })
    .from(postsTable)
    .innerJoin(usersTable, eq(postsTable.authorId, usersTable.id))
    .leftJoin(
      votesTable,
      and(eq(votesTable.postId, postsTable.id), eq(votesTable.userId, userId || -1))
    )
      .leftJoin(
        repliesTable,
        and(
          eq(repliesTable.postId, postsTable.id),
          isNull(repliesTable.parentReplyId)
        )
      )
      .groupBy(postsTable.id, usersTable.id, votesTable.id)
      .orderBy(
        desc(postsTable.createdAt),   // newest first
        desc(postsTable.id)           // tie-breaker for same timestamp
      );

  // format date
  function formatYMD(date: Date | string) {
    const d = date instanceof Date ? date : new Date(date);
    return d.toISOString().split("T")[0]; // "YYYY-MM-DD"
  }
  
  const rows: PostListRow[] = raw.map(r => ({
    post: {
      ...r.post,
      created_at: formatYMD(r.post.created_at),
      ended_at: r.post.ended_at ? formatYMD(r.post.ended_at) : null,
    },
    author: r.author,
    userVoteId: r.userVoteId,
    commentCount: r.commentCount,
  }));

  return (
    <main className="min-h-[calc(100svh-160px)] px-5 pb-[88px] md:px-26  md:py-5">
      <PostList rows={rows} isMyPost={false} />
    </main>
  );
}
