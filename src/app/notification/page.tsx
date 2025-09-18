import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { notifications, posts, users } from "@/db/schema/tables";
import { eq, desc } from "drizzle-orm";
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

  // Format notifications for client component
  const formattedNotifications = notificationData.map(({ notification, post, actor }) => ({
    id: notification.id,
    type: notification.type,
    postId: notification.postId,
    postTitle: post?.title || "",
    actorName: actor?.displayName || "사용자",
    isRead: notification.isRead,
    createdAt: notification.createdAt.toISOString(),
  }));

  console.log('Formatted notifications:', formattedNotifications);

  return <NotificationListClient notifications={formattedNotifications} />;
}