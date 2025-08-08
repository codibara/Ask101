'use client';

import { useEffect, useState } from 'react';

import { Announcement } from '@/types/announcement';
import { getAnnounceById } from "@/lib/announceService";

import PageHeader from '@/app/component/shared/pageHeader';


export default function PostDetail({ params }: { params: { announceId: string } }) {
  const [announce, setAnnounce] = useState<Announcement | null>(null);

  const announceId = parseInt(params.announceId, 10);

  useEffect(() => {
    getAnnounceById(announceId).then(setAnnounce);
  }, [announceId]);

  if (!announce) {
    return <div className="p-10 text-red-500">Post not found</div>;
  }

  const {
    title,
    content,
    date,
    commentCount,
    viewCount,
  } = announce;

  return (
    <main className="min-h-svh px-5 py-5 md:px-26 mb-[72px] md:mb-0">
      <div className='max-w-5xl mx-auto'>
        <PageHeader title='공지' showDropdown={false}/>
        {/* Post Details */}
        <div className="flex flex-col items-start gap-4 my-5">
          <div className="w-full">
            <h1 className="text-2xl font-bold mb-1.5">{title}</h1>
            <p className="text-sm">{date}</p>
          </div>
          <p className="text-base">{content}</p>
          
        </div>
      </div>
    </main>
  );
}
