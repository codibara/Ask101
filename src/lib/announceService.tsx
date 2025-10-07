import { db } from "@/db/index";
import { announcements } from "@/db/schema/tables";
import { eq } from "drizzle-orm";

export async function getAnnounceById(announceId: number) {
  try {
    const [announcement] = await db
      .select({
        announceId: announcements.id,
        title: announcements.title,
        content: announcements.content,
        date: announcements.createdAt,
        isActive: announcements.isActive,
      })
      .from(announcements)
      .where(eq(announcements.id, announceId))
      .limit(1);

    if (!announcement) {
      return null;
    }

    // Format date to YYYY-MM-DD
    const formattedDate = announcement.date.toISOString().split('T')[0];

    return {
      announceId: announcement.announceId,
      title: announcement.title,
      content: announcement.content,
      date: formattedDate,
      commentCount: 0, // Not tracking comments for announcements yet
      viewCount: 0, // Not tracking views for announcements yet
    };
  } catch (error) {
    console.error("Error fetching announcement:", error);
    return null;
  }
}

export async function getAllAnnouncements() {
  try {
    const allAnnouncements = await db
      .select({
        announceId: announcements.id,
        title: announcements.title,
        content: announcements.content,
        date: announcements.createdAt,
        isActive: announcements.isActive,
      })
      .from(announcements)
      .where(eq(announcements.isActive, true))
      .orderBy(announcements.createdAt);

    return allAnnouncements.map(announcement => ({
      announceId: announcement.announceId,
      title: announcement.title,
      content: announcement.content,
      date: announcement.date.toISOString().split('T')[0],
      commentCount: 0,
      viewCount: 0,
      isActive: announcement.isActive,
    }));
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }
}