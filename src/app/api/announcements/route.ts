import { NextResponse } from "next/server";
import { getAllAnnouncements, createAnnouncement } from "@/lib/announceService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const announcements = await getAllAnnouncements();
    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Error in /api/announcements:", error);
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication and admin status
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { title, content, isActive } = body;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Create announcement
    const newAnnouncement = await createAnnouncement({
      title,
      content,
      isActive: isActive ?? true,
    });

    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json(
      { error: "Failed to create announcement" },
      { status: 500 }
    );
  }
}