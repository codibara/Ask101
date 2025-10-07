import { NextResponse } from "next/server";
import { getAllAnnouncements } from "@/lib/announceService";

export async function GET() {
    try {
      const announcements = await getAllAnnouncements();
      return NextResponse.json(announcements);
    } catch (error) {
      console.error("Error in /api/announcements:", error);
      return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
    }
  }