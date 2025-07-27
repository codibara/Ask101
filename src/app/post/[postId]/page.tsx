'use client';

import { useEffect, useState } from 'react';
import { ChatLeftText, Eye, ArrowUpSquareFill, ExclamationTriangle } from 'react-bootstrap-icons';

import { Post } from "@/types/post";
import { mockUsers } from "@/data/mock_user_data";
import { mockComments } from "@/data/mock_comment";

import { getPostById } from "@/lib/postService";

import Pill from '@/app/component/ui/pill';
import CommentItem from "@/app/component/ui/commentItem";
import PageHeader from '@/app/component/shared/pageHeader';
import ConfirmModal from '@/app/component/ui/confirmModal';
import Button from '@/app/component/ui/button';

export default function PostDetail({ params }: { params: { postId: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);

  const handleOptionSelect = (option: 'A' | 'B') => {
    setSelectedOption(prev => (prev === option ? null : option));
  };

  const postId = parseInt(params.postId, 10);

  useEffect(() => {
    getPostById(postId).then(setPost);
  }, [postId]);

  const handleDelete = () => {
    console.log('Deleted!');
    // Add delete API logic here
    setModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentInput(e.target.value);
  };

  if (!post) {
    return <div className="p-10 text-red-500">Post not found</div>;
  }

  const user = mockUsers.find(u => u.userId === post.userId);
  if (!user) {
    return <div className="p-10 text-yellow-500">User not found</div>;
  }

  const {
    title,
    body,
    optionA,
    optionB,
    userId,
    postDate,
    commentCount,
    viewCount,
  } = post;

  const { gender, mbti, age, occupation } = user.userCategory;
  const comments = mockComments.filter(comment => comment.postId === postId);

  return (
    <main className="min-h-svh px-5 py-5 md:px-26 mb-[72px] md:mb-0">
      <div className='max-w-5xl mx-auto'>
        <PageHeader onDeleteClick={() => setModalOpen(true)} title='게시물'/>
        {/* Post Details */}
        <div className="flex flex-col items-start gap-4 my-5">
          <div className="w-full">
            <h1 className="text-2xl font-bold mb-1.5">{title}</h1>
            <Pill gender={gender} mbti={mbti} age={age} occupation={occupation} />
          </div>
          <p className="text-base">{body}</p>
        </div>

        <div className="flex flex-row justify-center gap-4 mb-5">
          <div className={`flex flex-col justify-center items-center w-full max-w-[290px] p-5 bg-main rounded-[10px] ${selectedOption === 'A' ? 'border-2 border-gray-400' : 'border-2 border-main'}`} onClick={() => handleOptionSelect('A')}>
            <p className="text-[64px] text-dark-950 font-semibold leading-16">71</p>
            <p className="text-xs text-dark-950">{optionA}</p>
          </div>
          <div className={`flex flex-col justify-center items-center w-full max-w-[290px] p-5 rounded-[10px] border bg-main-shade ${selectedOption === 'B' ? 'border-2 border-gray-400' : 'border-2 border-main-shade'}`} onClick={() => handleOptionSelect('B')}>
            <p className="text-[64px] text-dark-950 font-semibold leading-16">28</p>
            <p className="text-xs text-dark-950">{optionB}</p>
          </div>
        </div>

        <div className="flex flex-row justify-between text-sm">
          <div className="flex flex-row gap-2">
            <p className="font-medium">{userId}</p>
            <p className="font-medium">{postDate}</p>
          </div>
          <div className="flex flex-row gap-2">
            <div className="flex items-center gap-1">
              <ChatLeftText size={16} />
              <p className="text-xs font-medium">{commentCount}</p>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={16} />
              <p className="text-xs font-medium">{viewCount}</p>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          {/* Comment Heading */}
          <div className="border-y border-gray-600 py-2 mt-5">
            <p>댓글 {comments.length}</p>
          </div>
          {/* Comment Input (Fixed to bottom)*/}
          <div className='fixed bottom-[72px] left-0 md:hidden md:bottom-0 w-full gap-2 px-5 py-2 bg-dark-950 '>
            <div className='flex flex-row gap-3 items-center bg-dark-900 rounded-md pl-2 pr-1 py-1'>
              <input
                id="title"
                type="text"
                className="w-full px-2 bg-dark-900 rounded-md focus:outline-none "
                placeholder="댓글을 입력하세요"
                value={commentInput}
                onChange={handleInputChange}
              />
              <Button
                beforeIcon={<ChatLeftText size={16} color='#B19DFF'/>}
                variant='tertiary'
                disabled={false}
                isLink={false}
              />
            </div>
          </div>
          {/* Comment Input Desktop*/}
          <div className='hidden w-full md:block bg-dark-950'>
            <div className='flex flex-row gap-3 items-center bg-dark-900 rounded-md pl-2 pr-1 py-1'>
              <input
                id="title"
                type="text"
                className="w-full px-2 bg-dark-900 rounded-md focus:outline-none "
                placeholder="댓글을 입력하세요"
                value={commentInput}
                onChange={handleInputChange}
              />
              <Button
                beforeIcon={<ChatLeftText size={16} color='#B19DFF'/>}
                variant='tertiary'
                isLink={false}
              />
            </div>
          </div>
          {/* Comments */}
          <div className="flex flex-col gap-6">
          {comments.length > 0 ? (
            comments.map((c, i) => (
              <CommentItem
                key={i}
                postId={c.postId}
                userId={c.userId}
                comment={c.comment}
                commentId={c.commentId}
              />
            ))
          ) : (
            <p className="text-sm text-gray-400">아직 댓글이 없습니다.</p>
          )}
        </div>
      </div>
        
        
        {/* Confirmation Modal*/}
        <ConfirmModal
          icon={<ExclamationTriangle size={62} color='#B19DFF'/>}
          primaryText='삭제'
          secondaryText='취소'
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleDelete}
          title="삭제 후 복원할 수 없습니다."
          message="그래도 삭제 하시겠습니까?"
        />
      </div>
    </main>
  );
}
