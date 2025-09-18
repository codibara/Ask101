import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { posts, users, reply as repliesTable } from "@/db/schema/tables";
import { eq, desc, and, or, ne, isNotNull, sql } from "drizzle-orm";

export async function GET() {
  try {
    // @ts-expect-error: type error
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Fetch all notification types for the current user
    const notifications = [];

    // 1. Replies on user's posts (reply_on_post)
    const repliesOnMyPosts = await db
      .select({
        type: sql<string>`'reply_on_post'`,
        postId: repliesTable.postId,
        postTitle: posts.title,
        replyId: repliesTable.id,
        replyContent: repliesTable.reply,
        actorId: repliesTable.userId,
        actorName: users.displayName,
        createdAt: repliesTable.createdAt,
      })
      .from(repliesTable)
      .innerJoin(posts, eq(repliesTable.postId, posts.id))
      .innerJoin(users, eq(repliesTable.userId, users.id))
      .where(
        and(
          eq(posts.authorId, userId), // Post belongs to current user
          ne(repliesTable.userId, userId), // Reply not by current user
          sql`${repliesTable.parentReplyId} IS NULL` // Top-level replies only
        )
      )
      .orderBy(desc(repliesTable.createdAt))
      .limit(20);

    // 2. Replies on user's replies (reply_on_reply)
    const repliesOnMyReplies = await db
      .select({
        type: sql<string>`'reply_on_reply'`,
        postId: repliesTable.postId,
        postTitle: posts.title,
        replyId: repliesTable.id,
        replyContent: repliesTable.reply,
        parentReplyId: repliesTable.parentReplyId,
        actorId: repliesTable.userId,
        actorName: users.displayName,
        createdAt: repliesTable.createdAt,
      })
      .from(repliesTable)
      .innerJoin(posts, eq(repliesTable.postId, posts.id))
      .innerJoin(users, eq(repliesTable.userId, users.id))
      .where(
        and(
          ne(repliesTable.userId, userId), // Reply not by current user
          isNotNull(repliesTable.parentReplyId), // Must be a reply to another reply
          sql`${repliesTable.parentReplyId} IN (
            SELECT id FROM ${repliesTable} WHERE user_id = ${userId}
          )` // Parent reply belongs to current user
        )
      )
      .orderBy(desc(repliesTable.createdAt))
      .limit(20);

    // 3. Posts that ended (reached 101 votes) - for posts user participated in
    const endedPosts = await db
      .select({
        type: sql<string>`'post_ended'`,
        postId: posts.id,
        postTitle: posts.title,
        totalVotes: sql<number>`${posts.votesA} + ${posts.votesB}`,
        endedAt: posts.endedAt,
        createdAt: posts.endedAt,
      })
      .from(posts)
      .where(
        and(
          eq(posts.isEndVote, true),
          or(
            eq(posts.authorId, userId), // User's own posts
            sql`${posts.id} IN (
              SELECT post_id FROM votes WHERE user_id = ${userId}
            )`, // Posts user voted on
            sql`${posts.id} IN (
              SELECT post_id FROM ${repliesTable} WHERE user_id = ${userId}
            )` // Posts user replied to
          )
        )
      )
      .orderBy(desc(posts.endedAt))
      .limit(10);

    // 4. New activity on user's posts (recent votes or replies)
    const recentActivityOnMyPosts = await db
      .select({
        type: sql<string>`'post_activity'`,
        postId: posts.id,
        postTitle: posts.title,
        votesA: posts.votesA,
        votesB: posts.votesB,
        replyCount: sql<number>`(
          SELECT COUNT(*) FROM ${repliesTable}
          WHERE post_id = ${posts.id}
          AND parent_reply_id IS NULL
        )`,
        lastActivityAt: sql<Date>`GREATEST(
          ${posts.createdAt},
          COALESCE((
            SELECT MAX(created_at) FROM ${repliesTable}
            WHERE post_id = ${posts.id}
          ), ${posts.createdAt})
        )`,
        createdAt: posts.createdAt,
      })
      .from(posts)
      .where(
        and(
          eq(posts.authorId, userId),
          eq(posts.isEndVote, false)
        )
      )
      .orderBy(desc(sql`GREATEST(
        ${posts.createdAt},
        COALESCE((
          SELECT MAX(created_at) FROM ${repliesTable}
          WHERE post_id = ${posts.id}
        ), ${posts.createdAt})
      )`))
      .limit(10);

    // Combine all notifications
    notifications.push(
      ...repliesOnMyPosts.map(n => ({ ...n, type: 'reply_on_post' })),
      ...repliesOnMyReplies.map(n => ({ ...n, type: 'reply_on_reply' })),
      ...endedPosts.map(n => ({ ...n, type: 'post_ended' })),
      ...recentActivityOnMyPosts.map(n => ({ ...n, type: 'post_activity' }))
    );

    // Sort by createdAt (most recent first)
    notifications.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    // Format dates
    const formattedNotifications = notifications.map(n => ({
      ...n,
      createdAt: n.createdAt instanceof Date ? n.createdAt.toISOString() :
                 n.createdAt ? new Date(n.createdAt).toISOString() : null,
    }));

    return NextResponse.json(formattedNotifications);
  } catch (error) {
    console.error("/api/notifications GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}