import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { votes, posts } from "@/db/schema/tables";
import { eq, and } from "drizzle-orm/expressions";
import { checkAndAutoEndVote } from "@/lib/voteService";

// GET: List all votes or a single vote by ?id=
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get("id");

  if (idParam) {
    const id = parseInt(idParam);
    const voteData = await db.select().from(votes).where(eq(votes.id, id));
    if (!voteData.length) {
      return NextResponse.json({ error: "Vote not found" }, { status: 404 });
    }
    return NextResponse.json(voteData[0]);
  } else {
    const allVotes = await db.select().from(votes);
    return NextResponse.json(allVotes);
  }
}

// POST: Create a new vote
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if user already voted on this post
    const existingVote = await db
      .select()
      .from(votes)
      .where(and(eq(votes.userId, body.userId), eq(votes.postId, body.postId)));

    if (existingVote.length > 0) {
      return NextResponse.json(
        { error: "User already voted on this post" },
        { status: 400 }
      );
    }

    // Insert the new vote
    const newVote = await db
      .insert(votes)
      .values({
        userId: body.userId,
        postId: body.postId,
        vote: body.vote,
        // createdAt will default via schema if not provided
      })
      .returning();

    // Update the vote count for the post
    const voteIncrement =
      body.vote === "A"
        ? { votesA: votes.votesA + 1 }
        : { votesB: votes.votesB + 1 };

    await db.update(posts).set(voteIncrement).where(eq(posts.id, body.postId));

    // Check if total votes reached 101 and auto-end the vote
    await checkAndAutoEndVote(body.postId);

    return NextResponse.json(newVote[0], { status: 201 });
  } catch (error) {
    console.error("Error creating vote:", error);
    return NextResponse.json(
      { error: "Failed to create vote" },
      { status: 500 }
    );
  }
}

// PUT: Update a vote (?id=)
export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get("id");
  if (!idParam) {
    return NextResponse.json({ error: "Missing vote id" }, { status: 400 });
  }
  const id = parseInt(idParam);
  try {
    const body = await request.json();
    const updatedVote = await db
      .update(votes)
      .set({
        userId: body.userId,
        postId: body.postId,
        vote: body.vote,
      })
      .where(eq(votes.id, id))
      .returning();
    if (!updatedVote.length) {
      return NextResponse.json({ error: "Vote not found" }, { status: 404 });
    }
    return NextResponse.json(updatedVote[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update vote" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a vote (?id=)
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get("id");
  if (!idParam) {
    return NextResponse.json({ error: "Missing vote id" }, { status: 400 });
  }
  const id = parseInt(idParam);
  try {
    const deletedVote = await db
      .delete(votes)
      .where(eq(votes.id, id))
      .returning();
    if (!deletedVote.length) {
      return NextResponse.json({ error: "Vote not found" }, { status: 404 });
    }
    return NextResponse.json(deletedVote[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete vote" },
      { status: 500 }
    );
  }
}
