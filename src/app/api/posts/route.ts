import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { posts, users } from "@/db/schema/tables";
import { and, desc, eq, lt, or } from "drizzle-orm";


type Cursor = { createdAt: string; id: number } | null;

export async function GET(request: Request) {
  try {
    // @ts-expect-error: type error
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id) || -1; // available if you later need user-scoped data

    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");

    function formatYMD(date: Date | string | null): string | null {
      if (!date) return null;
      const d = date instanceof Date ? date : new Date(date);
      return d.toISOString().split("T")[0]; // "YYYY-MM-DD"
    }

    // --- Single post by id ---------------------------------------------------
    if (idParam) {
      const id = Number(idParam);
      const result = await db
        .select({
          postId: posts.id,
          title: posts.title,
          content: posts.content,
          option_a: posts.optionA,
          option_b: posts.optionB,
          votes_a: posts.votesA,
          votes_b: posts.votesB,
          is_end_vote: posts.isEndVote,
          created_at: posts.createdAt,
          ended_at: posts.endedAt,
          author: {
            userId: users.id,
            display_name: users.displayName,
            sex: users.sex,
            mbti: users.mbti,
            birth_year: users.birthYear,
            job: users.job,
            age: users.age,
          },
        })
        .from(posts)
        .innerJoin(users, eq(posts.authorId, users.id))
        .where(eq(posts.id, id));

      if (!result.length) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
      return NextResponse.json(result[0]);
    }

    // --- Paginated list (keyset/cursor) -------------------------------------
    // ?limit=10 (1..50)
    const limit = Math.max(1, Math.min(50, Number(searchParams.get("limit") ?? 10)));

    // ?cursor={"createdAt":"2025-08-01T12:00:00.000Z","id":42}
    let cursor: Cursor = null;
    const rawCursor = searchParams.get("cursor");
    if (rawCursor) {
      try {
        const c = JSON.parse(rawCursor);
        if (c && typeof c.createdAt === "string" && typeof c.id === "number") {
          cursor = c;
        }
      } catch {
        // ignore bad cursor
      }
    }

    const whereKeyset = cursor
      ? or(
          lt(posts.createdAt, new Date(cursor.createdAt)),
          and(eq(posts.createdAt, new Date(cursor.createdAt)), lt(posts.id, cursor.id))
        )
      : undefined;

    const baseSelect = db
      .select({
        postId: posts.id,
        title: posts.title,
        content: posts.content,
        option_a: posts.optionA,
        option_b: posts.optionB,
        votes_a: posts.votesA,
        votes_b: posts.votesB,
        is_end_vote: posts.isEndVote,
        created_at: posts.createdAt,
        ended_at: posts.endedAt,
        author: {
          userId: users.id,
          display_name: users.displayName,
          sex: users.sex,
          mbti: users.mbti,
          birth_year: users.birthYear,
          job: users.job,
          age: users.age,
        },
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .orderBy(desc(posts.createdAt), desc(posts.id))
      .limit(limit + 1); // fetch one extra to detect "has more"

    const rows = whereKeyset ? await baseSelect.where(whereKeyset) : await baseSelect;

    const page = rows.slice(0, limit).map((r) => ({
      post: {
        id: r.postId,
        title: r.title,
        content: r.content,
        author_id: r.author.userId,
        created_at: formatYMD(r.created_at)!,
        option_a: r.option_a,
        option_b: r.option_b,
        votes_a: r.votes_a,
        votes_b: r.votes_b,
        ended_at: formatYMD(r.ended_at),
        is_end_vote: r.is_end_vote ?? null,
      },
      author: {
        id: r.author.userId,
        displayName: r.author.display_name,
        sex: r.author.sex,
        mbti: r.author.mbti,
        birthYear: r.author.birth_year,
        job: r.author.job,
        age: r.author.age,
      },
      commentCount: 0,        // or whatever you select
      userVoteId: null,       // or whatever you select
    }));
    const hasMore = rows.length > limit;

    const last = page[page.length - 1];
    const nextCursor: Cursor =
  hasMore && last
    ? {
        createdAt: new Date(last.post.created_at).toISOString(),
        id: last.post.id,
      }
    : null;

    return NextResponse.json({ items: page, nextCursor, userId });
  } catch (err) {
    console.error("/api/posts GET error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Create a new post
export async function POST(request: Request) {
  try {
    // @ts-expect-error: type error
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const { title, content, optionA, optionB } = await request.json();
    if (!title?.trim() || !optionA?.trim() || !optionB?.trim()) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const contentSafe = typeof content === "string" ? content.trim() : "";

    const [row] = await db
      .insert(posts)
      .values({
        title: title.trim(),
        content: contentSafe.trim(),
        authorId: userId,
        optionA: optionA.trim(),
        optionB: optionB.trim(),
        votesA: 0,
        votesB: 0,
        isEndVote: false,
      })
      .returning({ id: posts.id });
    return NextResponse.json(row, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

// PUT: Update a post (?id=)
export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get("id");
  if (!idParam) {
    return NextResponse.json({ error: "Missing post id" }, { status: 400 });
  }
  const id = parseInt(idParam);
  try {
    const body = await request.json();
    const updatedPost = await db
      .update(posts)
      .set({
        title: body.title,
        content: body.content,
        authorId: body.authorId,
        optionA: body.optionA,
        optionB: body.optionB,
        votesA: body.votesA,
        votesB: body.votesB,
        isEndVote: body.isEndVote,
        endedAt: body.endedAt,
      })
      .where(eq(posts.id, id))
      .returning();
    if (!updatedPost.length) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(updatedPost[0]);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a post (?id=)

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");
    if (!idParam) {
      return NextResponse.json({ error: "Missing post id" }, { status: 400 });
    }
    const id = Number(idParam);
    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const deleted = await db.delete(posts).where(eq(posts.id, id)).returning();
    if (!deleted.length) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(deleted[0], { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/posts] error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
