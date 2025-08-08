"use client";

import { Comment } from "@/types/post";
import { mockReplies } from "@/data/mock_reply";
import { mockUsers } from "@/data/mock_user_data";
import Pill from "@/app/component/ui/pill";
import { ChatLeftText } from "react-bootstrap-icons";
import Button from "./button";

import { use, useState, useEffect } from "react";

interface CommentProp extends Comment {
  setIsAnyReplyOpen: (open: boolean) => void;
  isAnyReplyOpen: boolean;
  isLoggedIn: boolean;
}

const CommentItem = ({
  postId,
  userId,
  commentId,
  comment,
  setIsAnyReplyOpen,
  isAnyReplyOpen,
  isLoggedIn,
}: CommentProp) => {
  const user = mockUsers.find((u) => u.userId === userId);
  const replies = mockReplies.filter((r) => r.commentId === commentId);

  const [isOpen, setIsOpen] = useState(true);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [commentInput, setCommentInput] = useState("");

  const handleReplyList = () => {
    setIsOpen((prev) => !prev);
  };

  //toggle replay input
  const handleReplyInput = () => {
    setIsReplyOpen((prev) => !prev);
  };

  useEffect(() => {
    setIsAnyReplyOpen(isReplyOpen);
  }, [isReplyOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentInput(e.target.value);
  };

  if (!user) return null;

  const { gender, mbti, age, occupation } = user.userCategory;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        <Pill gender={gender} mbti={mbti} age={age} occupation={occupation} />
        <p>{comment}</p>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-2 -mt-1">
            <p className="text-sm text-gray-500">{user.userId}</p>
            <p className="text-sm text-gray-500">2025/01/23</p>
          </div>
          <div className="flex flex-row gap-2 cursor-pointer items-center">
            {/* Show reply functionality only for logged-in users */}
            {isLoggedIn && (
              <>
                <div
                  className="flex flex-row items-center gap-1 text-gray-500 hover:brightness-125"
                  onClick={handleReplyInput}
                >
                  <p className="text-sm font-medium">답글달기</p>
                </div>
                <div
                  className="flex flex-row items-center gap-1 text-gray-500 hover:brightness-125"
                  onClick={handleReplyList}
                >
                  <ChatLeftText size={16} />
                  <p className="text-xs font-medium underline -mt-1 underline-offset-1">
                    {replies.length}
                  </p>
                </div>
              </>
            )}
            {/* Show reply count for non-logged in users but make it non-interactive */}
            {!isLoggedIn && replies.length > 0 && (
              <div className="flex flex-row items-center gap-1 text-gray-500">
                <ChatLeftText size={16} />
                <p className="text-xs font-medium">{replies.length}</p>
                <p className="text-xs text-gray-400">(로그인 후 확인)</p>
              </div>
            )}
          </div>
        </div>
        {/*Reply Input - Only show for logged-in users*/}
        {isLoggedIn && (
          <div
            className={`${isReplyOpen ? "block" : "hidden"} w-full bg-dark-950`}
          >
            <div className="flex flex-row gap-3 items-center bg-dark-900 rounded-md pl-2 pr-1 mb-1">
              <input
                id="title"
                type="text"
                className="w-full px-2 bg-dark-900 rounded-md focus:outline-none "
                placeholder="답글을 입력하세요"
                value={commentInput}
                onChange={handleInputChange}
              />
              <Button
                beforeIcon={<ChatLeftText size={16} color="#B19DFF" />}
                variant="tertiary"
                isLink={false}
              />
            </div>
          </div>
        )}
      </div>
      {/* Show replies only for logged-in users */}
      {isLoggedIn &&
        replies.map((r) => {
          const replier = mockUsers.find((u) => u.userId === r.userId);
          if (!replier) return null;
          const { gender, mbti, age, occupation } = replier.userCategory;

          return (
            <div
              className={`${isOpen ? "flex" : "hidden"} flex-col gap-2 ml-10`}
              key={r.replyId}
            >
              <Pill
                gender={gender}
                mbti={mbti}
                age={age}
                occupation={occupation}
              />
              <p>{r.comment}</p>
              <div className="flex flex-row gap-2 -mt-1">
                <p className="text-sm text-gray-500">
                  {replier ? replier.userId : r.userId}
                </p>
                <p className="text-sm text-gray-500">2025/01/23</p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default CommentItem;
