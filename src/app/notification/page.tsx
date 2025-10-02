import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { notifications, posts, users } from "@/db/schema/tables";
import { eq, desc } from "drizzle-orm";
import NotificationListClient from "./NotificationListClient";
import { mockAnouncement } from "@/data/mock_announcement";

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
    let title = "";

    // For announcements, get title from mock data
    if (notification.type === "announcement" && notification.announceId) {
      const announcement = mockAnouncement.find(a => a.announceId === notification.announceId);
      title = announcement?.title || "";
    } else {
      // For other notifications, use post title
      title = post?.title || "";
    }

    return {
      id: notification.id,
      type: notification.type,
      postId: notification.postId || undefined,
      announceId: notification.announceId || undefined,
      postTitle: title,
      actorName: actor?.displayName || "사용자",
      isRead: notification.isRead,
      createdAt: notification.createdAt.toISOString(),
    };
  });

  // Add static announcements for all users (always show at the top)
  const staticAnnouncements = mockAnouncement.map((announcement) => ({
    id: -announcement.announceId, // Use negative ID to avoid conflicts with real notifications
    type: "announcement" as const,
    postId: undefined,
    announceId: announcement.announceId,
    postTitle: announcement.title,
    actorName: "관리자",
    isRead: false, // Always show as unread
    createdAt: announcement.date + "T00:00:00.000Z",
  }));

  // Combine static announcements with user notifications
  const allNotifications = [...staticAnnouncements, ...formattedNotifications];

  console.log('Formatted notifications:', allNotifications);

  return <NotificationListClient notifications={allNotifications} />;
}