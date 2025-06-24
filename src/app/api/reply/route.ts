import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { reply } from "@/db/schema/tables";
import { eq } from "drizzle-orm/expressions";

// GET: List all replies or a single reply by ?id=
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get("id");

  if (idParam) {
    const id = parseInt(idParam);
    const replyData = await db.select().from(reply).where(eq(reply.id, id));
    if (!replyData.length) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 });
    }
    return NextResponse.json(replyData[0]);
  } else {
    const allReplies = await db.select().from(reply);
    return NextResponse.json(allReplies);
  }
}

// POST: Create a new reply
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newReply = await db
      .insert(reply)
      .values({
        reply: body.reply,
        userId: body.userId,
        postId: body.postId,
        isDeleted: body.isDeleted ?? false,
        // createdAt will default via schema if not provided
      })
      .returning();
    return NextResponse.json(newReply[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create reply" },
      { status: 500 }
    );
  }
}

// PUT: Update a reply (?id=)
export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get("id");
  if (!idParam) {
    return NextResponse.json({ error: "Missing reply id" }, { status: 400 });
  }
  const id = parseInt(idParam);
  try {
    const body = await request.json();
    const updatedReply = await db
      .update(reply)
      .set({
        reply: body.reply,
        userId: body.userId,
        postId: body.postId,
        isDeleted: body.isDeleted,
      })
      .where(eq(reply.id, id))
      .returning();
    if (!updatedReply.length) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 });
    }
    return NextResponse.json(updatedReply[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update reply" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a reply (?id=)
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get("id");
  if (!idParam) {
    return NextResponse.json({ error: "Missing reply id" }, { status: 400 });
  }
  const id = parseInt(idParam);
  try {
    const deletedReply = await db
      .delete(reply)
      .where(eq(reply.id, id))
      .returning();
    if (!deletedReply.length) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 });
    }
    return NextResponse.json(deletedReply[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete reply" },
      { status: 500 }
    );
  }
}
