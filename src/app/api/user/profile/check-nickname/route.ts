// app/api/user/check-nickname/route.ts
import { db } from "@/db";
import { eq, and, isNotNull } from "drizzle-orm";
import { users } from "@/db/schema/tables";

export async function POST(req: Request) {
  const { nickname } = await req.json();

  if (!nickname) {
    return new Response(JSON.stringify({ error: "닉네임을 입력해주세요." }), { status: 400 });
  }

  // Check if another user has this nickname
  const existing = await db
    .select()
    .from(users)
    .where(
        and(
          eq(users.displayName, nickname),
          isNotNull(users.id)
        )
      )

  return new Response(JSON.stringify({ exists: existing.length > 0}), { status: 200 });
}
