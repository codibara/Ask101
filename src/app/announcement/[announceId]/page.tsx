'use client';

import { useEffect, useState } from 'react';

import { Announcement } from '@/types/announcement';
import { getAnnounceById } from "@/lib/announceService";

import PageHeader from '@/app/component/shared/pageHeader';

interface Props {
  params: { announceId: string };
}

export default function PostDetail({ params }: Props) {
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
  } = announce;

  return (
    <main className="min-h-[calc(100svh-160px)] px-5 pb-[88px] md:px-26 md:py-5">
      <div className='max-w-2xl mx-auto'>
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
