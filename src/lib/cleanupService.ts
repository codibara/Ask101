import { db } from "@/db/index";
import { notifications, announcementReads } from "@/db/schema/tables";
import { lt } from "drizzle-orm";

/**
 * Delete notifications older than 1 month
 */
export async function cleanupOldNotifications() {
  try {
    // Calculate date 1 month ago
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Delete notifications older than 1 month
    await db
      .delete(notifications)
      .where(lt(notifications.createdAt, oneMonthAgo));

    console.log(`Cleaned up old notifications (older than ${oneMonthAgo.toISOString()})`);
    return true;
  } catch (error) {
    console.error("Error cleaning up old notifications:", error);
    return false;
  }
}

/**
 * Delete announcement reads older than 1 month
 * (Optional: Only if you want to reset read status after 1 month)
 */
export async function cleanupOldAnnouncementReads() {
  try {
    // Calculate date 1 month ago
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Delete announcement reads older than 1 month
    await db
      .delete(announcementReads)
      .where(lt(announcementReads.readAt, oneMonthAgo));

    console.log(`Cleaned up old announcement reads (older than ${oneMonthAgo.toISOString()})`);
    return true;
  } catch (error) {
    console.error("Error cleaning up old announcement reads:", error);
    return false;
  }
}

/**
 * Run all cleanup tasks
 */
export async function runCleanupTasks() {
  await cleanupOldNotifications();
  // Optionally clean up old announcement reads
  // await cleanupOldAnnouncementReads();
}
