import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { roles } from "@/db/schema/tables";
import { eq } from "drizzle-orm/expressions";

// GET: List all roles or a single role by ?id=
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get("id");

  if (idParam) {
    const id = parseInt(idParam);
    const roleData = await db.select().from(roles).where(eq(roles.id, id));
    if (!roleData.length) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }
    return NextResponse.json(roleData[0]);
  } else {
    const allRoles = await db.select().from(roles);
    return NextResponse.json(allRoles);
  }
}

// POST: Create a new role
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newRole = await db
      .insert(roles)
      .values({
        name: body.name,
      })
      .returning();
    return NextResponse.json(newRole[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create role" },
      { status: 500 }
    );
  }
}

// PUT: Update a role (?id=)
export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get("id");
  if (!idParam) {
    return NextResponse.json({ error: "Missing role id" }, { status: 400 });
  }
  const id = parseInt(idParam);
  try {
    const body = await request.json();
    const updatedRole = await db
      .update(roles)
      .set({ name: body.name })
      .where(eq(roles.id, id))
      .returning();
    if (!updatedRole.length) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }
    return NextResponse.json(updatedRole[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a role (?id=)
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get("id");
  if (!idParam) {
    return NextResponse.json({ error: "Missing role id" }, { status: 400 });
  }
  const id = parseInt(idParam);
  try {
    const deletedRole = await db
      .delete(roles)
      .where(eq(roles.id, id))
      .returning();
    if (!deletedRole.length) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }
    return NextResponse.json(deletedRole[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete role" },
      { status: 500 }
    );
  }
}
