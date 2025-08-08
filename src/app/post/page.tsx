'use client';

import { useRouter } from 'next/navigation';
import PostForm from '@/app/component/ui/postForm';

export default function CreatePostPage() {
  const router = useRouter();

  const handleCreate = async ({ title, content, optionA, optionB }: any) => {
    console.log('Title:', title);
    console.log('Content:', content);
    console.log('Option A:', optionA);
    console.log('Option B:', optionB);

    // Replace this with your POST API
    const newPostId = 1;
    router.push(`/post/${newPostId}`);
  };

  return <PostForm onSubmit={handleCreate} isEdit={false}/>;
}
