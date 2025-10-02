import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { announcementReads } from "@/db/schema/tables";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // @ts-expect-error: type error
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const announcementId = parseInt(id, 10);

    if (isNaN(announcementId)) {
      return NextResponse.json({ error: "Invalid announcement ID" }, { status: 400 });
    }

    // Insert or update the read record
    await db
      .insert(announcementReads)
      .values({
        userId,
        announcementId,
      })
      .onConflictDoNothing(); // Don't error if already read

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking announcement as read:", error);
    return NextResponse.json(
      { error: "Failed to mark announcement as read" },
      { status: 500 }
    );
  }
}
