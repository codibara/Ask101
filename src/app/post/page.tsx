'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import PageHeader from '@/app/component/shared/pageHeader';
import Button from '../component/ui/button';

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
      <main className="px-5 py-5 md:px-26">
        <div className='max-w-5xl mx-auto'>
          <PageHeader 
            showBack={false}
            showDropdown={false}
            title='새 게시물'
            />
          <div className="flex flex-col gap-6 h-full min-h-[calc(100svh-240px)]">
            {/* Title Input */}
            <div className='w-full flex flex-row gap-2 py-2 rounded-md items-center'>
              <TextareaAutosize
                  value={title}
                  maxLength={35}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  minRows={1}
                  className="px-4 py-2 rounded-md focus:outline-none resize-none flex-grow"
              />
              <div className="text-xs  text-gray-500">
                {title.length}/35자
              </div>
            </div>
            {/* Content Textarea */}
            <div className="w-full relative">
              <TextareaAutosize
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요 (선택)"
                minRows={6}
                maxLength={500}
                className="w-full px-4 py-2 pb-6 bg-dark-900 rounded-md focus:outline-none resize-none flex-grow"
              />
              <div className="absolute left-3 bottom-4 text-xs text-gray-500">
                {content.length}/500자
              </div>
            </div>
            {/* Option Inputs */}
            <div className='flex-grow'>
              <p className="block text-sm font-medium mb-2">
                투표 옵션 설정
              </p>
              <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                <input
                  type="text"
                  className="px-4 py-2 md:flex-1/2 bg-dark-900 rounded-md focus:outline-none"
                  placeholder="옵션 A"
                  id='optionA'
                />
                <input
                  type="text"
                  className="px-4 py-2 md:flex-1/2  bg-dark-900 rounded-md focus:outline-none"
                  placeholder="옵션 B"
                />
              </div>
            </div>
            {/* Submit Button */}
            <div className='flex flex-row justify-end'>
              <Button
                text="투표 시작"
                variant='primary'
                onClick={handleSave}
                isLink={false}
                isLoading={true}
              />
            </div>
          </div>
        </div>
      </main>
    );
  }