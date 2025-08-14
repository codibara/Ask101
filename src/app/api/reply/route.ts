import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { reply, users } from "@/db/schema/tables";
import { eq } from "drizzle-orm";

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

// -------- POST: create reply and return WITH author --------
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const replyText = String(body.reply ?? "").trim();
    const userIdNum = Number(body.userId);
    const postIdNum = Number(body.postId);
    const parentIdNum =
      body.parent_reply_id == null ? null : Number(body.parent_reply_id);

    if (!replyText) {
      return NextResponse.json({ error: "Empty reply" }, { status: 400 });
    }
    if (!Number.isFinite(userIdNum) || !Number.isFinite(postIdNum)) {
      return NextResponse.json({ error: "Invalid userId/postId" }, { status: 400 });
    }
    if (parentIdNum !== null && !Number.isFinite(parentIdNum)) {
      return NextResponse.json({ error: "Invalid parent_reply_id" }, { status: 400 });
    }

    const [inserted] = await db
      .insert(reply)
      .values({
        reply: replyText,
        userId: userIdNum,                // or derive from session
        postId: postIdNum,
        parentReplyId: parentIdNum,       // drizzle camelCase column
        isDeleted: Boolean(body.isDeleted) || false,
      })
      .returning({ id: reply.id });

    if (!inserted) {
      return NextResponse.json({ error: "Insert failed" }, { status: 500 });
    }

    const [joined] = await db
      .select({
        id: reply.id,
        post_id: reply.postId,
        user_id: reply.userId,
        reply: reply.reply,
        parent_reply_id: reply.parentReplyId,
        is_deleted: reply.isDeleted,
        created_at: reply.createdAt,
        author: {
          userId: users.id,
          display_name: users.displayName,
          sex: users.sex,
          mbti: users.mbti,
          job: users.job,
          name: users.name,
          email: users.email,
          birth_year: users.birthYear,
          age: users.age,              
        },
      })
      .from(reply)
      .innerJoin(users, eq(reply.userId, users.id))
      .where(eq(reply.id, inserted.id))
      .limit(1);

    return NextResponse.json(joined, { status: 201 });
  } catch (error) {
    console.error("POST /api/reply error:", error);
    return NextResponse.json({ error: "Failed to create reply" }, { status: 500 });
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
