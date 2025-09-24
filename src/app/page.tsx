import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPostsPage } from "@/lib/getPostService";
import PostListClient from "./postListClient"; // new client component


export type PostListRow = {
  post: {
    id: number;
    title: string;
    content: string;
    author_id: number;
    created_at: string;            // normalize to string for client
    option_a: string;
    option_b: string;
    votes_a: number;
    votes_b: number;
    view_count: number;
    ended_at: string | null;
    is_end_vote: boolean | null;       // normalize to string|null
  };
  author: {
    id: number;
    displayName: string | null;
    sex: string | null;
    mbti: string | null;
    birthYear: number | null;
    job: string | null;
    age: string | null;
  };
  commentCount: number,
  userVoteId: number | null,
  userVoteChoice: "A" | "B" | null,
};

export default async function Home() {
  // @ts-expect-error: type error
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id) || -1;  // or null if not logged in
  
  const { items, nextCursor } = await getPostsPage({ limit: 10, cursor: null, userId });

  return (
    <main className="min-h-[calc(100svh-160px)] px-5 pb-[88px] md:px-26 md:py-5">
      <PostListClient initialRows={items} initialCursor={nextCursor} />
    </main>
  );
}
