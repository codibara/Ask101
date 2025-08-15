import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { posts, users } from "@/db/schema/tables";
import { eq } from "drizzle-orm";

// GET: List all posts or a single post by ?id=
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get("id");

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
