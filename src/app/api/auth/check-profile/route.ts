import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema/tables";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // @ts-expect-error: error placeholder
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated", redirectTo: "/login" },
        { status: 401 }
      );
    }

    // Check if user has displayName
    const userResult = await db
      .select({ displayName: users.displayName })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (userResult.length > 0 && userResult[0].displayName) {
      // User has displayName, redirect to home
      return NextResponse.json({ redirectTo: "/" });
    } else {
      // User doesn't have displayName, redirect to settings
      return NextResponse.json({ redirectTo: "/setting" });
    }
  } catch (error) {
    console.error("Error checking user profile:", error);
    // Fallback to settings on error
    return NextResponse.json({ redirectTo: "/setting" });
  }
}
