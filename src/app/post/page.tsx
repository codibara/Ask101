'use client';

import { useRouter } from 'next/navigation';
import PostForm from '@/app/component/ui/postForm';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

export default function CreatePostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const { status } = useSession();
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login?callbackUrl=' + encodeURIComponent('/myposts'));
    }
  }, [status, router]);
  if (status === 'loading') return null;

  const handleCreate = async ({ title, content, optionA, optionB }: {
    title: string; content: string; optionA: string; optionB: string;
  }) => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, optionA, optionB }),
      });

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: 'Failed' }));
        throw new Error(error || 'Failed to create post');
      }

      //const { id } = await res.json(); // from returning({ id: posts.id })
      router.push(`/mypost`);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return <PostForm onSubmit={handleCreate} isEdit={false} isSubmitting={saving} />;
}
