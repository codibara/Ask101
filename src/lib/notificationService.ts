import { db } from "@/db/index";
import { notifications, posts, reply as repliesTable } from "@/db/schema/tables";
import { eq, and } from "drizzle-orm";

export const NotificationService = {
  // Create notification when someone replies to a post
  async createReplyOnPostNotification(postId: number, actorId: number, replyId: number) {
    try {
      // Get the post author
      const post = await db
        .select({ authorId: posts.authorId })
        .from(posts)
        .where(eq(posts.id, postId))
        .limit(1);

      if (!post.length || post[0].authorId === actorId) {
        return; // Don't notify if replying to own post
      }

      await db.insert(notifications).values({
        userId: post[0].authorId,
        type: "reply_on_post",
        postId,
        actorId,
        replyId,
        isRead: false,
      });
    } catch (error) {
      console.error("Error creating reply_on_post notification:", error);
    }
  },

  // Create notification when someone replies to a reply
  async createReplyOnReplyNotification(postId: number, actorId: number, replyId: number, parentReplyId: number) {
    try {
      // Get the parent reply author
      const parentReply = await db
        .select({ userId: repliesTable.userId })
        .from(repliesTable)
        .where(eq(repliesTable.id, parentReplyId))
        .limit(1);

      if (!parentReply.length || parentReply[0].userId === actorId) {
        return; // Don't notify if replying to own reply
      }

      await db.insert(notifications).values({
        userId: parentReply[0].userId,
        type: "reply_on_reply",
        postId,
        actorId,
        replyId,
        isRead: false,
      });
    } catch (error) {
      console.error("Error creating reply_on_reply notification:", error);
    }
  },

  // Create notification when post reaches 101 votes
  async createPostEndedNotification(postId: number) {
    try {
      // Get the post author and all participants
      const post = await db
        .select({ authorId: posts.authorId })
        .from(posts)
        .where(eq(posts.id, postId))
        .limit(1);

      if (!post.length) return;

      // Notify post author
      await db.insert(notifications).values({
        userId: post[0].authorId,
        type: "post_ended",
        postId,
        isRead: false,
      });

      // TODO: Optionally notify all participants (voters, commenters)
    } catch (error) {
      console.error("Error creating post_ended notification:", error);
    }
  },

  // Create notification for post activity
  async createPostActivityNotification(postId: number, actorId: number) {
    try {
      const post = await db
        .select({ authorId: posts.authorId })
        .from(posts)
        .where(eq(posts.id, postId))
        .limit(1);

      if (!post.length || post[0].authorId === actorId) {
        return; // Don't notify for own activity
      }

      // Check if a recent activity notification already exists
      const existingNotification = await db
        .select()
        .from(notifications)
        .where(
          and(
            eq(notifications.userId, post[0].authorId),
            eq(notifications.type, "post_activity"),
            eq(notifications.postId, postId)
          )
        )
        .limit(1);

      if (existingNotification.length > 0) {
        // Update the existing notification's timestamp
        await db
          .update(notifications)
          .set({ createdAt: new Date(), isRead: false })
          .where(eq(notifications.id, existingNotification[0].id));
      } else {
        // Create new activity notification
        await db.insert(notifications).values({
          userId: post[0].authorId,
          type: "post_activity",
          postId,
          actorId,
          isRead: false,
        });
      }
    } catch (error) {
      console.error("Error creating post_activity notification:", error);
    }
  },

  // Mark notification as read
  async markAsRead(notificationId: number, userId: number) {
    try {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(
          and(
            eq(notifications.id, notificationId),
            eq(notifications.userId, userId)
          )
        );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  },

  // Mark all notifications as read for a user
  async markAllAsRead(userId: number) {
    try {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.userId, userId));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  },
};