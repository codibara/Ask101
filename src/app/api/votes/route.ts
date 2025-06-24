import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { votes } from "@/db/schema/tables";
import { eq } from "drizzle-orm/expressions";

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
    const newVote = await db
      .insert(votes)
      .values({
        userId: body.userId,
        postId: body.postId,
        vote: body.vote,
        // createdAt will default via schema if not provided
      })
      .returning();
    return NextResponse.json(newVote[0], { status: 201 });
  } catch (error) {
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
