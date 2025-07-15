'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PageHeader from '@/app/component/shared/pageHeader';

export default function Post() {

  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');

  const handleSave = () => {
    console.log('Title:', title);
    console.log('Content:', content);
    console.log('Option A:', optionA);
    console.log('Option B:', optionB);

    // Placeholder for save logic
    // Simulate post creation and navigate to detail page
    const newPostId = 1; // This would be returned from API later
    router.push(`/post/${newPostId}`);
  };

    return (
      <main className="min-h-svh px-5 py-5 md:px-26">
        <div className='max-w-5xl mx-auto'>
          <PageHeader 
            showBack={false}
            showDropdown={false}
            title='새 게시물'
            />
          <div className="flex flex-col gap-6">
            {/* Title Input */}
            <div>
              <input
                id="title"
                type="text"
                className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="제목을 입력하세요"
              />
            </div>
            {/* Content Textarea */}
            <div className='h-70vh'>
              <textarea
                id="content"
                rows={6}
                className="w-full px-4 py-2 bg-dark-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="내용을 입력하세요 (선택)"
              />
            </div>

            {/* Option Inputs */}
            <div>
              <p className="block text-sm font-medium mb-2">
                투표 옵션 설정
              </p>
              <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <input
                  type="text"
                  className="px-4 py-2 md:flex-1/2 bg-dark-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="옵션 A"
                  id='optionA'
                />
                <input
                  type="text"
                  className="px-4 py-2 md:flex-1/2  bg-dark-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="옵션 B"
                />
              </div>
            </div>
            {/* Submit Button */}
            <button
              onClick={handleSave}
              className="bg-main py-4 px-8 rounded-xl font-semibold text-dark-950 md:ml-auto hover:cursor-pointer"
            >
              투표 시작
            </button>
          </div>
        </div>
      </main>
    );
  }