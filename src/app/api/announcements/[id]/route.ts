import { NextResponse } from "next/server";
import {
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  toggleAnnouncementActive,
} from "@/lib/announceService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const announcementId = parseInt(id);

    if (isNaN(announcementId)) {
      return NextResponse.json({ error: "Invalid announcement ID" }, { status: 400 });
    }

    const announcement = await getAnnouncementById(announcementId);

    if (!announcement) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    }

    return NextResponse.json(announcement);
  } catch (error) {
    console.error("Error fetching announcement:", error);
    return NextResponse.json({ error: "Failed to fetch announcement" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    // Check authentication and admin status
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { id } = await params;
    const announcementId = parseInt(id);

    if (isNaN(announcementId)) {
      return NextResponse.json({ error: "Invalid announcement ID" }, { status: 400 });
    }

    // Parse request body
    const body = await request.json();
    const { title, content, isActive } = body;

    // Update announcement
    const updatedAnnouncement = await updateAnnouncement(announcementId, {
      title,
      content,
      isActive,
    });

    if (!updatedAnnouncement) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAnnouncement);
  } catch (error) {
    console.error("Error updating announcement:", error);
    return NextResponse.json({ error: "Failed to update announcement" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    // Check authentication and admin status
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { id } = await params;
    const announcementId = parseInt(id);

    if (isNaN(announcementId)) {
      return NextResponse.json({ error: "Invalid announcement ID" }, { status: 400 });
    }

    // Delete announcement
    await deleteAnnouncement(announcementId);

    return NextResponse.json({ success: true, message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    // Check authentication and admin status
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { id } = await params;
    const announcementId = parseInt(id);

    if (isNaN(announcementId)) {
      return NextResponse.json({ error: "Invalid announcement ID" }, { status: 400 });
    }

    // Toggle active state
    const updatedAnnouncement = await toggleAnnouncementActive(announcementId);

    return NextResponse.json(updatedAnnouncement);
  } catch (error) {
    console.error("Error toggling announcement active state:", error);
    return NextResponse.json(
      { error: "Failed to toggle announcement active state" },
      { status: 500 }
    );
  }
}
