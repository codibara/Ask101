import { NextResponse } from "next/server";
import { db } from "@/db/index"
import { users } from "@/db/schema/tables";
import { eq } from "drizzle-orm/expressions";
import { getAgeFromBirthYear, getAgeBucket } from "@/lib/ageCategory";

// GET: List all users or a single user by ?id=
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get("id");

  if (idParam) {
    const id = parseInt(idParam);
    const user = await db.select().from(users).where(eq(users.id, id));
    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user[0]);
  } else {
    const allUsers = await db.select().from(users);
    return NextResponse.json(allUsers);
  }
}

// POST: Create a new user
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Normalize birthYear: accept number/string, convert to number or null
    const rawBY = body.birthYear;
    let birthYear: number | null = null;
    if (rawBY !== undefined && rawBY !== null && String(rawBY).trim() !== "") {
      const n = Number(rawBY);
      if (!Number.isNaN(n)) birthYear = n;
    }

    // Compute age bucket if we have a valid birthYear
    const ageBucket = birthYear != null
      ? getAgeBucket(getAgeFromBirthYear(birthYear))
      : null;

    const [newUser] = await db
      .insert(users)
      .values({
        displayName: body.displayName ?? null,
        sex: body.sex ?? null,
        mbti: body.mbti ?? null,
        birthYear,                                   // number | null
        age: ageBucket ?? null,                      // your schema allows null
        isNotificationOn: body.isNotificationOn ?? false,
        // DO NOT include unknown fields like role, post, savedPosts unless
        // you add them to the `users` table schema first.
      })
      .returning();

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}


// PUT: Update an existing user (?id=)
export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get("id");
  if (!idParam) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }
  const id = parseInt(idParam);
  try {
    const body = await request.json();
    const updatedUser = await db
      .update(users)
      .set({
        displayName: body.displayName,
        sex: body.sex,
        age: body.age,
        mbti: body.mbti,
        isNotificationOn: body.isNotificationOn,
      })
      .where(eq(users.id, id))
      .returning();
    if (!updatedUser.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(updatedUser[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

// DELETE: Remove a user (?id=)
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get("id");
  if (!idParam) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }
  const id = parseInt(idParam);
  try {
    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();
    if (!deletedUser.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(deletedUser[0]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}