'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import TextareaAutosize from 'react-textarea-autosize';
import Button from '../component/ui/button'
import PageHeader from '../component/shared/pageHeader';
import { Announcement } from '@/types/announcement';
import { Trash3, Pencil, EyeFill, EyeSlash, ExclamationTriangle } from 'react-bootstrap-icons';
import ConfirmModal from '../component/ui/confirmModal';

export default function AdminPage() {

  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);


  const isFormValid = title.trim().length > 0;
  //const [saving, setSaving] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login?callbackUrl=' + encodeURIComponent('/admin'));
    } else if (status === 'authenticated' && !session?.user?.isAdmin) {
      // Redirect non-admin users to home page
      router.replace('/');
    }
  }, [status, session, router]);
  useEffect(() => {
    async function loadAnnouncements() {
      const res = await fetch('/api/announcements');
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    }
    loadAnnouncements();
  }, []);

  if (status === 'loading') return null;

  // Don't render admin page for non-admin users
  if (!session?.user?.isAdmin) return null;

  const handleSave = async ({ title, content }: {
    title: string; content: string;
  }) => {
    if (!isFormValid) return;
    setSaving(true);
    try {
      if (editingId) {
        // Update existing announcement
        const res = await fetch(`/api/announcements/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content }),
        });

        if (res.ok) {
          const updatedAnnouncement = await res.json();
          setAnnouncements(announcements.map(a =>
            a.announceId === editingId ? { ...a, title: updatedAnnouncement.title, content: updatedAnnouncement.content } : a
          ));
          setTitle('');
          setContent('');
          setEditingId(null);
        } else {
          console.error("Failed to update announcement");
        }
      } else {
        // Create new announcement
        const res = await fetch('/api/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content, isActive: true }),
        });

        if (res.ok) {
          const newAnnouncement = await res.json();
          setAnnouncements([newAnnouncement, ...announcements]);
          setTitle('');
          setContent('');
        } else {
          console.error("Failed to create announcement");
        }
      }
    } catch (error) {
      console.error("Error saving announcement:", error);
    } finally {
      setSaving(false);
    }
  }

  const handleEdit = (id: number) => {
    const announcement = announcements.find(a => a.announceId === id);
    if (!announcement) return;

    setTitle(announcement.title);
    setContent(announcement.content);
    setEditingId(id);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleCancelEdit = () => {
    setTitle('');
    setContent('');
    setEditingId(null);
  }

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/announcements/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setAnnouncements(announcements.filter(a => a.announceId !== id));
      } else {
        console.error("Failed to delete announcement");
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  }

  const handleActive = async (id: number) => {
    try {
      const res = await fetch(`/api/announcements/${id}`, {
        method: 'PATCH',
      });

      if (res.ok) {
        const updatedAnnouncement = await res.json();
        setAnnouncements(announcements.map(a =>
          a.announceId === id ? { ...a, isActive: updatedAnnouncement.isActive } : a
        ));
      } else {
        console.error("Failed to toggle announcement active state");
      }
    } catch (error) {
      console.error("Error toggling announcement active state:", error);
    }
  }

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  

  return (
    <main className="min-h-[calc(100svh-160px)] px-5 pb-[88px] md:px-26 md:py-5">
          <div className="max-w-2xl mx-auto">
            <PageHeader showBack={false} showDropdown={false} title="관리자 페이지"/>
            <div className="flex flex-col gap-6 h-full min-h-[calc(100svh-210px)] md:min-h-[calc(100svh-100px)]">
              {/* Editing indicator */}
              {editingId && (
                <div className="flex items-center justify-between px-4 py-2 rounded-md border border-main">
                  <p className="text-sm text-main">공지사항 수정 중...</p>
                  <button
                    onClick={handleCancelEdit}
                    className="text-xs text-main underline"
                  >
                    취소
                  </button>
                </div>
              )}

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
                    text={editingId ? "수정하기" : "저장하기"}
                    variant="primary"
                    onClick={() => handleSave({ title, content })}
                    isLink={false}
                    isLoading={saving}
                    disabled={saving || !isFormValid}
                />
              <div>
                <div className='mt-4'>
                <p className="block text-sm font-medium">공지 리스트</p>
                <ul className='flex flex-col gap-2 mt-4'>
                {announcements.map((post) => {
                    const isExpanded = expandedId === post.announceId;
                    return (
                    <li
                        key={post.announceId}
                        onClick={() => toggleExpand(post.announceId)}
                        className="w-[100%] flex flex-col sm:flex-row gap-2 cursor-pointer bg-dark-900 hover:bg-neutral-800 p-4 rounded-md"
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
                                onClick={() => {
                                  setDeleteTargetId(post.announceId);
                                  setIsModalOpen(true);
                                }}
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
            
          </div>
          {/* Confirmation Modal */}
          <ConfirmModal
            icon={<ExclamationTriangle size={62} color="#7CF9DC" />}
            primaryText="삭제"
            secondaryText="취소"
            title ='삭제 후 복원할 수 없습니다.'
            message = '그래도 삭제 하시겠습니까?'
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setDeleteTargetId(null);
            }}
            onConfirm={() => {
              if (deleteTargetId) handleDelete(deleteTargetId);
              setIsModalOpen(false);
              setDeleteTargetId(null);
            }}
          />
        </main>
  );
}
