import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { votes, posts } from "@/db/schema/tables";
import { eq, and } from "drizzle-orm/expressions";
import { checkAndAutoEndVote } from "@/lib/voteService";
import { sql } from "drizzle-orm";

// GET: List all votes or a single vote by ?id=
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get("id");
  const postIdParam = searchParams.get("postId");
  const userIdParam = searchParams.get("userId");

  // status check
  if (postIdParam && userIdParam) {
    const [row] = await db
      .select({ id: votes.id, vote: votes.vote })
      .from(votes)
      .where(and(eq(votes.postId, Number(postIdParam)), eq(votes.userId, Number(userIdParam))))
      .limit(1);
    return NextResponse.json(row ?? null);
  }

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

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userIdNumber, postIdNumber, newVote } = body as {
      userIdNumber: number;
      postIdNumber: number;
      newVote: "A" | "B";
    };

    if (!userIdNumber || !postIdNumber || (newVote !== "A" && newVote !== "B")) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    // 1) Update the existing vote for this (userId, postId)
    const [updated] = await db
      .update(votes)
      .set({ vote: newVote })
      .where(and(eq(votes.userId, userIdNumber), eq(votes.postId,postIdNumber)))
      .returning({ id: votes.id });

    if (!updated) {
      // No existing vote row for this user/post
      return NextResponse.json(
        { error: "Vote not found for this user/post" },
        { status: 404 }
      );
    }

    // 2) Recalculate post tallies in one statement
    const [updatedPost] = await db
      .update(posts)
      .set({
        votesA: sql<number>`(
          SELECT COUNT(*)
          FROM ${votes}
          WHERE ${votes.postId} = ${postIdNumber} AND ${votes.vote} = 'A'
        )`,
        votesB: sql<number>`(
          SELECT COUNT(*)
          FROM ${votes}
          WHERE ${votes.postId} = ${postIdNumber} AND ${votes.vote} = 'B'
        )`,
      })
      .where(eq(posts.id, postIdNumber))
      .returning({
        id: posts.id,
        votesA: posts.votesA,
        votesB: posts.votesB,
      });

    return NextResponse.json({ updatedPost }, { status: 200 });
  } catch (error) {
    console.error("Error updating vote (no-tx path):", error);
    return NextResponse.json({ error: "Failed to update vote" }, { status: 500 });
  }
}

// POST: Create a new vote
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userIdNum = Number(body.userId);   // <-- coerce
    const postIdNum = Number(body.postId);

    if (!userIdNum || !postIdNum || (body.vote !== "A" && body.vote !== "B")) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Check if user already voted on this post
    const existingVote = await db
      .select({ id: votes.id })
      .from(votes)
      .where(and(eq(votes.userId, userIdNum), eq(votes.postId, postIdNum)))
      .limit(1);

    if (existingVote.length > 0) {
      return NextResponse.json(
        { error: "User already voted on this post" },
        { status: 400 }
      );
    }

    // Insert the new vote
    const [newVote] = await db
      .insert(votes)
      .values({
        userId: userIdNum,
        postId: postIdNum,
        vote: body.vote as "A" | "B",
      })
      .returning({ id: votes.id, vote: votes.vote });

    // Recalculate tallies in one statement and return them
    const [updatedPost] = await db
      .update(posts)
      .set({
        votesA: sql<number>`(
          SELECT COUNT(*) FROM ${votes}
          WHERE ${votes.postId} = ${postIdNum} AND ${votes.vote} = 'A'
        )`,
        votesB: sql<number>`(
          SELECT COUNT(*) FROM ${votes}
          WHERE ${votes.postId} = ${postIdNum} AND ${votes.vote} = 'B'
        )`,
      })
      .where(eq(posts.id, postIdNum))
      .returning({ id: posts.id, votesA: posts.votesA, votesB: posts.votesB });

    // optional: auto-end logic
    await checkAndAutoEndVote(postIdNum);

    // IMPORTANT: match the shape your client expects
    return NextResponse.json({ newVote, updatedPost }, { status: 201 });
  } catch (error) {
    console.error("Error creating vote:", error);
    return NextResponse.json({ error: "Failed to create vote" }, { status: 500 });
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
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to delete vote" },
      { status: 500 }
    );
  }
}
