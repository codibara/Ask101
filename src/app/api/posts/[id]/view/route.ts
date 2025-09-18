import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { posts } from "@/db/schema/tables";
import { eq, sql } from "drizzle-orm";

// POST: Increment view count for a post
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const postId = parseInt(params.id);

    if (!postId || isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    // Increment view count
    const result = await db
      .update(posts)
      .set({
        viewCount: sql`${posts.viewCount} + 1`
      })
      .where(eq(posts.id, postId))
      .returning({ viewCount: posts.viewCount });

    if (!result.length) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      viewCount: result[0].viewCount
    });
  } catch (error) {
    console.error("Error incrementing view count:", error);
    return NextResponse.json(
      { error: "Failed to update view count" },
      { status: 500 }
    );
  }
}