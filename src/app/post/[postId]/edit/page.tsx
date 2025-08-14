// app/post/[postId]/edit/page.tsx
import { db } from "@/db";
import { posts as postsTable } from "@/db/schema/tables";
import { eq } from "drizzle-orm";
import EditPostClient from "./EditPostClient";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const id = Number(postId);

  if (!Number.isFinite(id)) {
    return <div>Invalid post id</div>;
  }

  // ✅ use the numeric id here
  const [post] = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.id, id)) // id is number
    .limit(1);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <EditPostClient
      postId={post.id}
      initialTitle={post.title}
      initialContent={post.content}
      initialOptionA={post.optionA}
      initialOptionB={post.optionB}
    />
  );
}
