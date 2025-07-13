import { posts } from "@/data/mock_posts_full";
import { Post } from "@/types/post";

export async function getPostById(postId: number): Promise<Post | null> {
    return posts.find(p => p.postId === postId) ?? null;
  }
