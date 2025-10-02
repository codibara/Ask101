import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { notifications, posts, users, announcements, announcementReads } from "@/db/schema/tables";
import { eq, desc, and } from "drizzle-orm";
import NotificationListClient from "./NotificationListClient";

export default async function NotificationPage() {
  // @ts-expect-error: type error
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);

  console.log('Notification page - Session user:', session?.user);
  console.log('Notification page - User ID:', userId);

  if (!userId) {
    redirect("/login");
  }

  // Fetch notifications with related data
  const notificationData = await db
    .select({
      notification: {
        id: notifications.id,
        type: notifications.type,
        isRead: notifications.isRead,
        createdAt: notifications.createdAt,
        postId: notifications.postId,
        announceId: notifications.announceId,
        replyId: notifications.replyId,
      },
      post: {
        id: posts.id,
        title: posts.title,
        content: posts.content,
      },
      actor: {
        id: users.id,
        displayName: users.displayName,
      },
    })
    .from(notifications)
    .leftJoin(posts, eq(notifications.postId, posts.id))
    .leftJoin(users, eq(notifications.actorId, users.id))
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(50);

  console.log('Fetched notifications count:', notificationData.length);

  // Format database notifications for client component
  const formattedNotifications = notificationData.map(({ notification, post, actor }) => {
    return {
      id: notification.id,
      type: notification.type,
      postId: notification.postId || undefined,
      announceId: notification.announceId || undefined,
      postTitle: post?.title || "",
      actorName: actor?.displayName || "사용자",
      isRead: notification.isRead,
      createdAt: notification.createdAt.toISOString(),
    };
  });

  // Fetch active announcements from database (show to all users)
  const activeAnnouncements = await db
    .select({
      id: announcements.id,
      title: announcements.title,
      createdAt: announcements.createdAt,
    })
    .from(announcements)
    .where(eq(announcements.isActive, true))
    .orderBy(desc(announcements.createdAt));

  // Get which announcements this user has read
  const readAnnouncementIds = await db
    .select({
      announcementId: announcementReads.announcementId,
    })
    .from(announcementReads)
    .where(eq(announcementReads.userId, userId));

  const readIds = new Set(readAnnouncementIds.map(r => r.announcementId));

  // Convert announcements to notification format
  const announcementNotifications = activeAnnouncements.map((announcement) => ({
    id: -announcement.id, // Use negative ID to avoid conflicts with real notifications
    type: "announcement" as const,
    postId: undefined,
    announceId: announcement.id,
    postTitle: announcement.title,
    actorName: "관리자",
    isRead: readIds.has(announcement.id), // Check if user has read this announcement
    createdAt: announcement.createdAt.toISOString(),
  }));

  // Combine announcements with user notifications
  const allNotifications = [...announcementNotifications, ...formattedNotifications];

  console.log('Formatted notifications:', allNotifications);

  return <NotificationListClient notifications={allNotifications} />;
}