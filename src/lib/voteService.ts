import { db } from "@/db";
import { posts } from "@/db/schema/tables";
import { eq } from "drizzle-orm";
import { NotificationService } from "./notificationService";

/**
 * Check if a post has reached 101 total votes and auto-end it if so
 * @param postId - The ID of the post to check
 * @returns Promise<boolean> - True if the vote was auto-ended, false otherwise
 */
export async function checkAndAutoEndVote(postId: number): Promise<boolean> {
  try {
    // Get current vote counts
    const postData = await db
      .select({
        votesA: posts.votesA,
        votesB: posts.votesB,
        isEndVote: posts.isEndVote,
      })
      .from(posts)
      .where(eq(posts.id, postId));

    if (postData.length === 0) {
      console.error(`Post ${postId} not found`);
      return false;
    }

    const post = postData[0];

    // If already ended, don't do anything
    if (post.isEndVote) {
      return false;
    }

    const totalVotes = post.votesA + post.votesB;

    // Check if total votes reached 101
    if (totalVotes >= 3) {
      // Auto-end the vote
      await db
        .update(posts)
        .set({
          isEndVote: true,
          endedAt: new Date(),
        })
        .where(eq(posts.id, postId));

      // Create notification for post ending
      await NotificationService.createPostEndedNotification(postId);

      console.log(
        `Vote auto-ended for post ${postId} with ${totalVotes} total votes`
      );
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error checking auto-end vote for post ${postId}:`, error);
    return false;
  }
}

/**
 * Get vote statistics for a post
 * @param postId - The ID of the post
 * @returns Promise<{votesA: number, votesB: number, totalVotes: number, isEnded: boolean}>
 */
export async function getVoteStats(postId: number) {
  try {
    const postData = await db
      .select({
        votesA: posts.votesA,
        votesB: posts.votesB,
        isEndVote: posts.isEndVote,
      })
      .from(posts)
      .where(eq(posts.id, postId));

    if (postData.length === 0) {
      throw new Error(`Post ${postId} not found`);
    }

    const post = postData[0];
    return {
      votesA: post.votesA,
      votesB: post.votesB,
      totalVotes: post.votesA + post.votesB,
      isEnded: post.isEndVote,
    };
  } catch (error) {
    console.error(`Error getting vote stats for post ${postId}:`, error);
    throw error;
  }
}
