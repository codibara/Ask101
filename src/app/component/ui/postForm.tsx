'use client';

import { useState, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import Button from '../ui/button';
import PageHeader from '../shared/pageHeader';

interface PostFormProps {
  initialTitle?: string;
  initialContent?: string;
  initialOptionA?: string;
  initialOptionB?: string;
  isSubmitting?: boolean;
  isEdit:boolean;
  onSubmit: (data: {
    title: string;
    content: string;
    optionA: string;
    optionB: string;
  }) => void;
  formTitle?: string;
}

export default function PostForm({
  initialTitle = '',
  initialContent = '',
  initialOptionA = '',
  initialOptionB = '',
  isSubmitting = false,
  onSubmit,
  formTitle = '새 게시물',
  isEdit = false
}: PostFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [optionA, setOptionA] = useState(initialOptionA);
  const [optionB, setOptionB] = useState(initialOptionB);

  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    setOptionA(initialOptionA);
    setOptionB(initialOptionB);
  }, [initialTitle, initialContent, initialOptionA, initialOptionB]);

  const handleSubmit = () => {
    onSubmit({ title, content, optionA, optionB });
  };

  return (
    <main className="px-5 py-5 md:px-26">
      <div className="max-w-2xl mx-auto">
        <PageHeader showBack={isEdit ? true : false} showDropdown={false} title={formTitle}/>
        
        <div className="flex flex-col gap-6 h-full min-h-[calc(100svh-240px)] md:min-h-[calc(100svh-100px)]">
          {/* Title */}
          <div className="w-full flex flex-row gap-2 py-2 rounded-md items-center">
            <TextareaAutosize
              value={title}
              maxLength={35}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              minRows={1}
              className="px-4 py-2 rounded-md focus:outline-none resize-none flex-grow"
            />
            <div className="text-xs text-gray-500">{title.length}/35자</div>
          </div>
          {/* Content */}
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
          {/* Options */}
          <div className="flex-grow">
            <p className="block text-sm font-medium mb-2">투표 옵션 설정</p>
            <div className="flex flex-col md:flex-row gap-2 md:gap-4">
              <input
                type="text"
                className="px-4 py-2 md:flex-1/2 bg-dark-900 rounded-md focus:outline-none"
                placeholder="옵션 A"
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
              />
              <input
                type="text"
                className="px-4 py-2 md:flex-1/2 bg-dark-900 rounded-md focus:outline-none"
                placeholder="옵션 B"
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
              />
            </div>
          </div>
          {/* Button */}
          <div className="flex flex-row justify-end">
            <Button
              text={isEdit ? "저장하기" : "투표 시작" }
              variant="primary"
              onClick={handleSubmit}
              isLink={false}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
