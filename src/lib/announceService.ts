import { db } from "@/db";
import { announcements } from "@/db/schema/tables";
import { eq } from "drizzle-orm";
import { desc } from "drizzle-orm";

/**
 * Get all announcements ordered by creation date (newest first)
 */
export async function getAllAnnouncements() {
  try {
    const allAnnouncements = await db
      .select({
        announceId: announcements.id,
        title: announcements.title,
        content: announcements.content,
        isActive: announcements.isActive,
        date: announcements.createdAt,
      })
      .from(announcements)
      .orderBy(desc(announcements.createdAt));

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
    console.error("Error fetching all announcements:", error);
    throw error;
  }
}

/**
 * Get active announcements only
 */
export async function getActiveAnnouncements() {
  try {
    const activeAnnouncements = await db
      .select({
        announceId: announcements.id,
        title: announcements.title,
        content: announcements.content,
        isActive: announcements.isActive,
        date: announcements.createdAt,
      })
      .from(announcements)
      .where(eq(announcements.isActive, true))
      .orderBy(desc(announcements.createdAt));

    return activeAnnouncements.map(announcement => ({
      announceId: announcement.announceId,
      title: announcement.title,
      content: announcement.content,
      date: announcement.date.toISOString().split('T')[0],
      commentCount: 0,
      viewCount: 0,
      isActive: announcement.isActive,
    }));
  } catch (error) {
    console.error("Error fetching active announcements:", error);
    throw error;
  }
}

/**
 * Get a single announcement by ID (with formatted response)
 */
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

    return {
      announceId: announcement.announceId,
      title: announcement.title,
      content: announcement.content,
      date: announcement.date.toISOString().split('T')[0],
      commentCount: 0,
      viewCount: 0,
      isActive: announcement.isActive,
    };
  } catch (error) {
    console.error("Error fetching announcement:", error);
    return null;
  }
}

/**
 * Get a single announcement by ID
 */
export async function getAnnouncementById(id: number) {
  try {
    const result = await db
      .select()
      .from(announcements)
      .where(eq(announcements.id, id));

    return result[0] || null;
  } catch (error) {
    console.error(`Error fetching announcement ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new announcement
 */
export async function createAnnouncement(data: {
  title: string;
  content: string;
  isActive?: boolean;
}) {
  try {
    const result = await db
      .insert(announcements)
      .values({
        title: data.title,
        content: data.content,
        isActive: data.isActive ?? true,
      })
      .returning();

    const announcement = result[0];
    return {
      announceId: announcement.id,
      title: announcement.title,
      content: announcement.content,
      date: announcement.createdAt.toISOString().split('T')[0],
      commentCount: 0,
      viewCount: 0,
      isActive: announcement.isActive,
    };
  } catch (error) {
    console.error("Error creating announcement:", error);
    throw error;
  }
}

/**
 * Update an existing announcement
 */
export async function updateAnnouncement(
  id: number,
  data: {
    title?: string;
    content?: string;
    isActive?: boolean;
  }
) {
  try {
    const result = await db
      .update(announcements)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(announcements.id, id))
      .returning();

    const announcement = result[0];
    if (!announcement) return null;

    return {
      announceId: announcement.id,
      title: announcement.title,
      content: announcement.content,
      date: announcement.createdAt.toISOString().split('T')[0],
      commentCount: 0,
      viewCount: 0,
      isActive: announcement.isActive,
    };
  } catch (error) {
    console.error(`Error updating announcement ${id}:`, error);
    throw error;
  }
}

/**
 * Delete an announcement
 */
export async function deleteAnnouncement(id: number) {
  try {
    await db.delete(announcements).where(eq(announcements.id, id));
    return { success: true };
  } catch (error) {
    console.error(`Error deleting announcement ${id}:`, error);
    throw error;
  }
}

/**
 * Toggle isActive state for an announcement
 */
export async function toggleAnnouncementActive(id: number) {
  try {
    // Get current state
    const current = await getAnnouncementById(id);
    if (!current) {
      throw new Error(`Announcement ${id} not found`);
    }

    // Toggle the isActive state
    const result = await db
      .update(announcements)
      .set({
        isActive: !current.isActive,
        updatedAt: new Date(),
      })
      .where(eq(announcements.id, id))
      .returning();

    const announcement = result[0];
    return {
      announceId: announcement.id,
      title: announcement.title,
      content: announcement.content,
      date: announcement.createdAt.toISOString().split('T')[0],
      commentCount: 0,
      viewCount: 0,
      isActive: announcement.isActive,
    };
  } catch (error) {
    console.error(`Error toggling announcement ${id} active state:`, error);
    throw error;
  }
}
