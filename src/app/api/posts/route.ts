import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { posts } from "@/db/schema/tables";
import { eq } from "drizzle-orm/expressions";

// GET: List all posts or a single post by ?id=
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get("id");

  if (idParam) {
    const id = parseInt(idParam);
    const postData = await db.select().from(posts).where(eq(posts.id, id));
    if (!postData.length) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(postData[0]);
  } else {
    const allPosts = await db.select().from(posts);
    return NextResponse.json(allPosts);
  }
}

// POST: Create a new post
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newPost = await db
      .insert(posts)
      .values({
        title: body.title,
        content: body.content,
        authorId: body.authorId,
        optionA: body.optionA,
        optionB: body.optionB,
        votesA: body.votesA ?? 0,
        votesB: body.votesB ?? 0,
        isEndVote: body.isEndVote ?? false,
        endedAt: body.endedAt, // expects a valid timestamp string
        // createdAt will default via schema if not provided
      })
      .returning();
    return NextResponse.json(newPost[0], { status: 201 });
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
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get("id");
  if (!idParam) {
    return NextResponse.json({ error: "Missing post id" }, { status: 400 });
  }
  const id = parseInt(idParam);
  try {
    const deletedPost = await db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning();
    if (!deletedPost.length) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(deletedPost[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
