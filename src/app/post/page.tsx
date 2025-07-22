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
            <div>
              <input
                id="title"
                type="text"
                className="w-full py-2 rounded-md focus:outline-none"
                placeholder="제목을 입력하세요"
              />
            </div>
            {/* Content Textarea */}
            <TextareaAutosize
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요 (선택)"
              minRows={6}
              className="w-full px-4 py-2 bg-dark-900 rounded-md focus:outline-none resize-none flex-grow"
            />
            {/* Option Inputs */}
            <div>
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
            <Button
              text="투표 시작"
              variant='primary'
              disabled={false}
              onClick={handleSave}
            />
          </div>
        </div>
      </main>
    );
  }