import { getPostById } from '@/lib/postService';
import EditPostClient from './EditPostClient';

export default async function EditPostPage({ params }: { params: { postId: string } }) {
    const postId = parseInt(params.postId, 10);
    const post = await getPostById(postId);

  if (!post) return <div>Post not found</div>;

  return (
    <EditPostClient
      postId={post.postId}
      initialTitle={post.title}
      initialContent={post.body}
      initialOptionA={post.optionA}
      initialOptionB={post.optionB}
    />
  );
}
