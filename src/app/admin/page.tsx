'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import TextareaAutosize from 'react-textarea-autosize';
import Button from '../component/ui/button'
import PageHeader from '../component/shared/pageHeader';
import { Announcement } from '@/types/announcement';
import { Trash3, Pencil, EyeFill, EyeSlash } from 'react-bootstrap-icons';

export default function AdminPage() {

  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const isFormValid = title.trim().length > 0;
  //const [saving, setSaving] = useState(false);
  const { status } = useSession();
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login?callbackUrl=' + encodeURIComponent('/myposts'));
    }
  }, [status, router]);
  useEffect(() => {
    async function loadAnnouncements() {
      const res = await fetch('/api/announcements');
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched announcements:", data); // 👈 check here
        setAnnouncements(data);
      }
    }
    loadAnnouncements();
  }, []);
  
  if (status === 'loading') return null;

  const handleCreate = async ({ title, content }: {
    title: string; content: string;
  }) => {
    if (!isFormValid) return;
    setTitle(title)
    setContent(content)
    console.log("Create pressed");
    
  }
  const handleEdit = async (id: number) => {
        console.log(id,"Edit pressed");
    
  }
  const handleDelete = async (id: number) => {
        console.log(id, "Delete pressed");
    
  }

  const handleActive = async (id: number) => {
    console.log(id,"Active pressed");

  }

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <main className="min-h-[calc(100svh-160px)] px-5 pb-[88px] md:px-26 md:py-5">
          <div className="max-w-2xl mx-auto">
            <PageHeader showBack={false} showDropdown={false} title="관리자 페이지"/>
            <div className="flex flex-col gap-6 h-full min-h-[calc(100svh-210px)] md:min-h-[calc(100svh-100px)]">
              {/* Title */}
              <div className="w-full flex flex-row gap-2 items-center">
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
              
                <Button
                    text="저장하기"
                    variant="primary"
                    onClick={() => handleCreate({ title, content })}
                    isLink={false}
                    //isLoading={isSubmitting}
                    //disabled={isSubmitting || !isFormValid}
                />
              <div>
                <ul className="bg-dark-900 p-4 rounded-lg">
                {announcements.map((post) => {
                    const isExpanded = expandedId === post.announceId;
                    return (
                    <li
                        key={post.announceId}
                        onClick={() => toggleExpand(post.announceId)}
                        className="w-[100%] flex flex-col sm:flex-row gap-2 cursor-pointer hover:bg-dark-800 rounded-md"
                    >
                        <div className="w-full sm:w-[70%] mr-4">
                        <p className="text-xs text-gray-400">{post.date}</p>
                        <p className="font-bold text-gray-300">{post.title}</p>
                        <p
                            className={`text-gray-400 text-sm mt-1 ${
                            isExpanded
                                ? "whitespace-pre-wrap"
                                : "truncate text-ellipsis overflow-hidden whitespace-nowrap"
                            }`}
                        >
                            {post.content}
                        </p>
                        </div>

                        <div
                        className="flex gap-2 sm:w-[200px] items-end justify-start sm:justify-end"
                        onClick={(e) => e.stopPropagation()} // prevent expanding when clicking buttons
                        >
                            <button
                                onClick={() => handleEdit(post.announceId)}
                                className="p-2 text-sm bg-main text-dark-950 rounded hover:bg-main-hover cursor-pointer"
                            >
                                <Pencil size={16}/>
                            </button>
                            <button
                                onClick={() => handleDelete(post.announceId)}
                                className="p-2 text-sm bg-main text-dark-950 rounded hover:bg-main-hover cursor-pointer"
                            >
                                <Trash3 size={16}/>
                            </button>
                            <button
                                onClick={() => handleActive(post.announceId)}
                                className="p-2 text-sm bg-main text-dark-950 rounded hover:bg-main-hover cursor-pointer"
                            >
                                { post.isActive ? <EyeFill size={16}/> : <EyeSlash size={16}/> }
                            </button>
                        </div>
                    </li>
                    );
                })}
                    </ul>

                </div>
            </div>
            
          </div>
        </main>
  );
}
