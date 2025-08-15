"use client";

import Pill from "@/app/component/ui/pill";
import { ChatLeftText } from "react-bootstrap-icons";
import Button from "./button";
import { useEffect, useState } from "react";
import type { Comment, User } from "@/types/post";

type ReplyItem = Comment & { author: User };

interface CommentItemProps extends Comment {
  author: User;
  isLoggedIn: boolean;
  setIsAnyReplyOpen: (open: boolean) => void;
  isAnyReplyOpen: boolean;
  replies?: ReplyItem[];
  onSubmitReply: (parentId: number, text: string) => Promise<void> | void; 
}

const CommentItem = ({
  id,
  reply,
  is_deleted,
  created_at,
  author,
  isLoggedIn,
  setIsAnyReplyOpen,
  replies = [],
  onSubmitReply
}: CommentItemProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [posting, setPosting] = useState(false);

  const handleReplyList = () => setIsOpen((prev) => !prev);
  const handleReplyInput = () => setIsReplyOpen((prev) => !prev);

  useEffect(() => {
    setIsAnyReplyOpen(isReplyOpen);
  }, [isReplyOpen, setIsAnyReplyOpen]);

  const handleReplySend = async () => {
    if (!onSubmitReply || !commentInput.trim() || posting) return;
    try {
      setPosting(true);
      await onSubmitReply(id, commentInput.trim()); // <-- pass this comment's id
      setCommentInput("");
    } finally {
      setPosting(false);
    }
  };

  const display_name= author.display_name;
  const pillSex = author?.sex;
  const pillMbti = author?.mbti;
  const pillAge = author?.age;
  const pillJob = author?.job;

  const createdAtLabel =
    created_at instanceof Date
      ? created_at.toLocaleDateString()
      : new Date(created_at).toLocaleDateString();

  return (
    <div className="flex flex-col gap-3">
      {/* Top-level comment */}
      <div className="flex flex-col gap-3">
        <Pill sex={pillSex} mbti={pillMbti} age={pillAge} job={pillJob} />
        <p>{is_deleted ? "관리자에 의해 삭제된 댓글 입니다." : reply}</p>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-2 -mt-1">
            <p className="text-sm text-gray-500">{display_name}</p>
            <p className="text-sm text-gray-500">{createdAtLabel}</p>
          </div>

          <div className="flex flex-row gap-2 items-center">
            {isLoggedIn && <div
              className="flex flex-row items-center gap-1 text-gray-500 hover:brightness-125 cursor-pointer"
              onClick={handleReplyInput}
            >
              <p className="text-sm font-medium">답글달기</p>
            </div>}
            <div
              className="flex flex-row items-center gap-1 text-gray-500 hover:brightness-125 cursor-pointer"
              onClick={handleReplyList}
            >
              <ChatLeftText size={16} />
              <p className="text-xs font-medium underline -mt-1 underline-offset-1">
                {replies.length}
              </p>
            </div>
          </div>
        </div>

        {/* Reply input */}
        {isLoggedIn && (
          <div className={`${isReplyOpen ? "block" : "hidden"} w-full bg-dark-950`}>
            <div className="flex flex-row gap-3 items-center bg-dark-900 rounded-md pl-2 pr-1 mb-1">
              <input
                type="text"
                className="w-full px-2 bg-dark-900 rounded-md focus:outline-none"
                placeholder="작성한 댓글은 수정 및 삭제가 불가합니다."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <Button
                beforeIcon={<ChatLeftText size={16} color="#B19DFF" />}
                variant="tertiary"
                isLink={false}
                disabled={!commentInput.trim()}
                onClick={handleReplySend}
              />
            </div>
          </div>
        )}
      </div>

      {/* Replies */}
      {
        replies.map((r) => {
        const isDeleted = r.is_deleted;
        const rDisplay = r.author?.display_name ?? r.user_id;
        const rPill = r.author;
        const rDate = r.created_at instanceof Date
          ? r.created_at.toLocaleDateString()
          : new Date(r.created_at).toLocaleDateString();

        return (
          <div className={`${isOpen ? "flex" : "hidden"} flex-col gap-2 ml-10`} key={r.id}>
            {rPill && <Pill sex={rPill.sex} mbti={rPill.mbti} age={rPill.age} job={rPill.job} />}
            {isDeleted ? <p>관리자에 의해 삭제된 댓글 입니다.</p> : <p>{r.reply}</p>}
            <div className="flex flex-row gap-2 -mt-1">
              <p className="text-sm text-gray-500">{rDisplay}</p>
              <p className="text-sm text-gray-500">{rDate}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommentItem;
