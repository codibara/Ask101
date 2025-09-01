"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChatLeftText, Eye, ExclamationTriangle } from "react-bootstrap-icons";

import Pill from "@/app/component/ui/pill";
import CommentItem from "@/app/component/ui/commentItem";
import PageHeader from "@/app/component/shared/pageHeader";
import ConfirmModal from "@/app/component/ui/confirmModal";
import Button from "@/app/component/ui/button";

import type { User } from "@/types/post";
import type { PostRow } from "./page";

// 1) Define the "kinds" your modal can show
type ModalKind = 'deletePost' | 'selfVote' | 'loginReqired' | 'voteEnded';

// Optional: each kind can carry some payload (ids, redirect url, etc.)
type ModalState = {
  open: boolean;
  kind?: ModalKind;
};

type CommentWithAuthor = {
  id: number;
  post_id: number;
  user_id: string;
  reply: string;
  parent_reply_id: string | null;
  is_deleted: boolean;
  created_at: string | Date;
  author: User;
};

export default function PostDetailClient({
  post,
  comments: initialComments,
}: {
  post: PostRow;
  comments: CommentWithAuthor[];
}) {

  const p = post.post;
  const a = post.author;

  const postId = p.id;
  const title = p.title;
  const content = p.content;
  const option_a = p.option_a;
  const option_b = p.option_b;
  const is_end_vote = p.is_end_vote;
  const created_at = p.created_at;
  const votes_a = p.votes_a;
  const votes_b = p.votes_b;

  // author fields (note: API uses displayName)
  const display_name = a.displayName; // keep your local var name if you like
  const pillSex = a.sex;
  const pillMbti = a.mbti;
  const pillAge = a.age;
  const pillJob = a.job;
  const router = useRouter();
  const { data: session } = useSession();

  const [commentInput, setCommentInput] = useState("");
  const [selectedOption, setSelectedOption] = useState<"A" | "B" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [, setDeleting] = useState(false);
  const [vA, setVA] = useState<number>(votes_a ?? 0);
  const [vB, setVB] = useState<number>(votes_b ?? 0);
  const [openReplyId, setOpenReplyId] = useState<number | null>(null);

  // If you have a “main input box”, hide it when ANY reply box is open:
  const isAnyReplyOpen = openReplyId !== null;
  const [voting, setVoting] = useState(false);

  // keep a local list so we can append without refetch
  const [allComments, setAllComments] = useState<CommentWithAuthor[]>(initialComments);

  const [modal, setModal] = useState<ModalState>({ open: false });
  const openModal = (kind: ModalKind) => setModal({ open: true, kind });
  const closeModal = () => setModal({ open: false, kind: undefined });

  const isLoggedIn = !!session?.user;
  const currentUserId = session?.user?.id;
  const isMyPost = currentUserId === a.id; 

  const isAWinning = (vA ?? 0) >= (vB ?? 0);
  const isBWinning = (vB ?? 0) >= (vA ?? 0);

  useEffect(() => {
    const fetchMyVote = async () => {
      if (!isLoggedIn || !currentUserId) return;
      const res = await fetch(`/api/votes?postId=${postId}&userId=${currentUserId}`, { cache: "no-store" });
      if (!res.ok) return;
      const row = await res.json(); // null or { id, vote: "A" | "B" }
      if (row?.vote === "A" || row?.vote === "B") {
        setSelectedOption(row.vote);
      }
      console.log(postId)
    };
    fetchMyVote();
  }, [isLoggedIn, currentUserId, postId, selectedOption]);




 // --- group comments whenever allComments changes
 const topLevel = useMemo(
    () => allComments.filter((c) => c.parent_reply_id == null),
    [allComments]
  );

  const repliesByParent = useMemo(() => {
    const acc: Record<number, CommentWithAuthor[]> = {};
    for (const c of allComments) {
      if (c.parent_reply_id != null) {
        const parentId = Number(c.parent_reply_id);
        (acc[parentId] ??= []).push(c);
      }
    }
    return acc;
  }, [allComments]);

  const dropdownButtonDisabled =
  (vA ?? 0) > 0 || (vB ?? 0) > 0 || topLevel.length > 0;

  const handleDelete = () => openModal('deletePost');

  //POST Vote
  const submitVote = async (choice: "A" | "B") => {
    if (voting) return;
    if (!isLoggedIn) { openModal('loginReqired') }
    if (!currentUserId) return;
    //Block Voting to ended post
    if (is_end_vote) { 
      openModal('voteEnded');
      return;
    };
    //Block Voting to my post
    if (isMyPost) { 
      openModal('selfVote');
      return;
    };
    try {
      setVoting(true);
      // No previous vote → POST
      if (!selectedOption && !isMyPost) {
        const res = await fetch("/api/votes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUserId, postId, vote: choice }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          if (res.status === 400 && data?.error) console.warn(data.error);
          return;
        }
        const { updatedPost } = await res.json();
        setVA(updatedPost.votesA);
        setVB(updatedPost.votesB);
        setSelectedOption(choice);
        return;
      }
      // Same choice → do nothing (or implement “unvote” if desired)
      if (selectedOption === choice) return;

      // Different choice → PUT (revise)
      const res = await fetch("/api/votes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIdNumber: currentUserId, postIdNumber: postId, newVote: choice }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Update vote failed:", data?.error || res.statusText);
        return;
      }
      const { updatedPost } = await res.json();
      setVA(updatedPost.votesA);
      setVB(updatedPost.votesB);
      setSelectedOption(choice);
    } finally {
      setVoting(false);
    }
  };
  

  // POST a new top-level comment
  const submitComment = async () => {
    const text = commentInput.trim();
    if (!isLoggedIn || !text || submitting) return;
    if (!currentUserId) {
      console.warn("댓글등록시 에러가 발생했습니다.");
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch("/api/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          userId: currentUserId,
          reply: text,
          parent_reply_id: null, // <-- top-level comment
        }),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || "Failed to create comment");
      }
      const created: CommentWithAuthor = await res.json();

      // optimistic update
      setAllComments((prev) => [created, ...prev]);
      setCommentInput("");
    } catch (err) {
      console.error(err);
      // TODO: toast error
    } finally {
      setSubmitting(false);
    }
  };

  // inside PostDetailClient
const submitChildReply = async (parentId: number, text: string) => {
  if (!isLoggedIn || !currentUserId || !text.trim()) return;
  const res = await fetch("/api/reply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      postId,
      userId: currentUserId,
      reply: text.trim(),
      parent_reply_id: parentId,     
    }),
  });
  if (!res.ok) {
    console.error("Failed to create reply");
    return;
  }
  const created: CommentWithAuthor = await res.json();

  setAllComments(prev => [created, ...prev]);
};

  
const handleDeleteAsync = async () => {
  try {
    setDeleting(true);
    const res = await fetch(`/api/posts?id=${postId}`, { method: "DELETE" });
    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      console.error("Delete failed:", msg || res.statusText);
      return false; 
    }
    router.replace("/");
    router.refresh?.(); 
    return true; 
  } finally {
    setDeleting(false);
  }
};

const MODAL_CONFIG: Record<ModalKind, {
  title?: string;
  message: string;
  primaryText: string;
  secondaryText?: string;
  icon: React.ReactNode;
  onConfirm?: () => void;
}> = {
  deletePost: {
    title: '삭제 후 복원할 수 없습니다.',
    message: '그래도 삭제 하시겠습니까?',
    primaryText: '삭제',
    secondaryText: '취소',
    icon: <ExclamationTriangle size={62} color="#7CF9DC" />,
    onConfirm: handleDeleteAsync,
  },
  selfVote: {
    message: '내 게시물에는 투표할 수 없습니다.',
    primaryText: '확인',
    icon: <ExclamationTriangle size={62} color="#7CF9DC" />,
    onConfirm: () => closeModal()
  },
  loginReqired: {
    message: '로그인이 필요한 서비스 입니다',
    primaryText: '로그인',
    secondaryText: '닫기',
    icon: <ExclamationTriangle size={62} color="#7CF9DC" />,
    onConfirm: () => router.push("/login")
  },
  voteEnded :{
    message: '투표가 완료된 게시글에는 투표할 수 없습니다.',
    primaryText: '확인',
    icon: <ExclamationTriangle size={62} color="#7CF9DC" />,
    onConfirm: () => closeModal()
      
  }
} as const;

  const cfg = modal.kind ? MODAL_CONFIG[modal.kind] : null;

  if (!post) {
    return <div className="p-10 text-red-500">Post not found</div>;
  }

  return (
    <main className="min-h-[calc(100svh-160px)] px-5 pb-[160px] md:px-26 md:py-5">
      <div className="max-w-2xl mx-auto md:mb-5">
      <PageHeader
          showDropdown={isMyPost ? true : false}
          onEditClick={() => router.push(`/post/${postId}/edit`)}
          onDeleteClick={handleDelete}
          isButtonDisabled={dropdownButtonDisabled}  
          title="게시물"
        />
        {/* Post Details */}
        <div className="flex flex-col items-start gap-4 mb-5">
          <div className="w-full">
            <h1 className="text-2xl font-bold mb-2">
            {is_end_vote && <span className="text-xs py-1 px-2 text-dark-950 bg-main rounded-sm mr-2 align-middle">투표완료</span>}
            {title}
            </h1>
            <Pill sex={pillSex} mbti={pillMbti} age={pillAge} job={pillJob} />
          </div>
          <p className="text-base whitespace-pre-wrap">{content}</p>
        </div>

        {/* Vote Box */}
        <div className="flex flex-row justify-center gap-4 mb-5">
          <button
            className={`flex flex-col justify-center items-center w-full max-w-[290px] p-5 border-2 ${isAWinning ? 'bg-main' : 'bg-main-shade'} rounded-[10px] cursor-pointer ${
              selectedOption === "A"
                ? "border-gray-400"
                : "border-transparent"
            }`}
            onClick={() => submitVote("A")}
          >
            <p className="text-[64px] text-dark-950 font-semibold leading-16">
              {vA ?? 0}
            </p>
            <p className="text-xs text-dark-950">{option_a}</p>
          </button>
          <button
            className={`flex flex-col justify-center items-center w-full max-w-[290px] p-5 border-2 ${isBWinning? 'bg-main' : 'bg-main-shade'} rounded-[10px] cursor-pointer ${
              selectedOption === "B"
                ? "border-gray-400"
                : "border-transparent"
            }`}
            onClick={() => submitVote("B")}
          >
            <p className="text-[64px] text-dark-950 font-semibold leading-16">
              {vB ?? 0}
            </p>
            <p className="text-xs text-dark-950">{option_b}</p>
          </button>
        </div>

        {/* Meta */}
        <div className="flex flex-row justify-between text-sm">
          <div className="flex flex-row gap-2">
            <p className="font-medium">{display_name}</p>
            <p className="font-medium">
              {created_at}
            </p>
          </div>
          <div className="flex flex-row gap-2">
            <div className="flex items-center gap-1">
              <ChatLeftText size={16} />
              <p className="text-xs font-medium">{topLevel.length}</p>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={16} />
              <p className="text-xs font-medium">0</p>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="flex flex-col gap-4">
          {/* Heading */}
          <div className="border-y border-gray-600 py-2 mt-5">
            <p>댓글 {topLevel.length}</p>
          </div>

          {/* Comment Input (mobile fixed) */}
          {!isAnyReplyOpen && (
            <div className="fixed bottom-[88px] left-0 md:hidden md:bottom-0 w-full gap-2 px-5 py-2 bg-dark-950 ">
              <div className="flex flex-row gap-3 items-center bg-dark-900 rounded-md pl-2 pr-1 py-1">
                <input
                  type="text"
                  className="w-full px-2 bg-dark-900 rounded-md focus:outline-none"
                  placeholder={isLoggedIn ? "작성한 댓글은 수정 및 삭제가 불가능합니다." : "댓글을 작성하려면 로그인이 필요합니다."}
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  disabled={isLoggedIn ? false : true}
                />
                {isLoggedIn ? (
                  <Button
                  beforeIcon={<ChatLeftText size={16} color="#7CF9DC" />}
                  variant="tertiary"
                  disabled={!commentInput.trim() || submitting}
                  onClick={submitComment}
                  isLink={false}
                />
                ) : (
                <div className="w-20">
                  <Button
                    text="로그인"
                    onClick={() => router.push("/login")}
                    variant="primary"
                    isLink={false}
                  />
                </div>)
                }
              </div>
            </div>
          )}

          {/* Comment Input (desktop) */}
          <div className="hidden w-full md:block bg-dark-950">
            <div className="flex flex-row gap-3 items-center bg-dark-900 rounded-md pl-2 pr-1 py-1">
              <input
                type="text"
                className="w-full px-2 bg-dark-900 rounded-md focus:outline-none"
                placeholder={isLoggedIn ? "작성한 댓글은 수정 및 삭제가 불가합니다." : "댓글을 작성하려면 로그인이 필요합니다."}
                value={commentInput}
                disabled={submitting || !isLoggedIn}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitComment();
                }}
                onChange={(e) => setCommentInput(e.target.value)}
              />
             {isLoggedIn ? (
                  <Button
                  beforeIcon={<ChatLeftText size={16} color="#7CF9DC" />}
                  variant="tertiary"
                  disabled={!commentInput.trim() || submitting}
                  onClick={submitComment}
                  isLink={false}
                />
                ) : (
                <div className="w-20">
                  <Button
                    text="로그인"
                    onClick={() => router.push("/login")}
                    variant="primary"
                    isLink={false}
                  />
                </div>)
                }
            </div>
          </div>
          {/* List */}
          <div className="flex flex-col gap-6">
            {topLevel.length > 0 ? (
                topLevel.map((c) => (
                <CommentItem
                    key={c.id}
                    id={c.id}
                    post_id={c.post_id}
                    user_id={c.user_id}
                    reply={c.reply}
                    author={c.author}
                    parent_reply_id={c.parent_reply_id}
                    is_deleted={c.is_deleted}
                    created_at={c.created_at}
                    isLoggedIn={isLoggedIn}
                    openReplyId={openReplyId}
                    setOpenReplyId={setOpenReplyId}
                    replies={repliesByParent[c.id] ?? []}
                    onSubmitReply={submitChildReply}
                />
                ))
            ) : (
                <p className="text-sm text-gray-400">아직 댓글이 없습니다.</p>
            )}
          </div>
        </div>

        {/* Confirmation Modal */}
        <ConfirmModal
          icon={cfg?.icon ?? null}
          primaryText={cfg?.primaryText ?? ''}
          secondaryText={cfg?.secondaryText ?? ''}
          isOpen={modal.open}
          onClose={closeModal}
          onConfirm={cfg?.onConfirm ?? closeModal}
          title={cfg?.title ?? ''}
          message={cfg?.message ?? ''}
        />
      </div>
    </main>
  );
}
