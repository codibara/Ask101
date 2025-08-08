'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PostForm from '@/app/component/ui/postForm';

type Props = {
  postId: number;
  initialTitle: string;
  initialContent: string;
  initialOptionA: string;
  initialOptionB: string;
};

export default function EditPostClient({
  postId,
  initialTitle,
  initialContent,
  initialOptionA,
  initialOptionB,
}: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async (data: {
    title: string;
    content: string;
    optionA: string;
    optionB: string;
  }) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push(`/post/${postId}`);
      } else {
        console.error('Failed to update post');
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PostForm
      initialTitle={initialTitle}
      initialContent={initialContent}
      initialOptionA={initialOptionA}
      initialOptionB={initialOptionB}
      onSubmit={handleUpdate}
      isSubmitting={isSubmitting}
      formTitle="게시물 수정"
      isEdit={true}
    />
  );
}
