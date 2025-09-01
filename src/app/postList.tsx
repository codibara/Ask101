"use client";

import { useState, useMemo } from "react";
import Card from "@/app/component/ui/card";
import PageHeader from "./component/shared/pageHeader";

type Row = {
  post: {
    id: number;
    title: string;
    content: string;
    author_id: number;
    created_at: string;
    option_a: string;
    option_b: string;
    votes_a: number;
    votes_b: number;
    ended_at: Date | string | null;
    is_end_vote: boolean | null;
  };
  author: {
    id: number;
    displayName: string | null;
    sex: string | null;
    mbti: string | null;
    birthYear: number | null;
    job: string | null;
    age: string | null;
  };
  commentCount: number,
  userVoteId: number | null;
};

export default function PostList({ rows, isMyPost }: { rows: Row[], isMyPost: boolean }) {
  type Tab = "ongoing" | "participating" | "ended";
  const [tab, setTab] = useState<Tab>("ongoing");

  const filtered = useMemo(() => {
    const isOngoing = (p: Row["post"]) =>
      (p.ended_at == null) && (p.is_end_vote !== true);
    switch (tab) {
      case "ongoing":
        return rows.filter(r => r.post.ended_at == null);
      case "participating":
        // userVoteId was set by the server join for the current user
        return rows.filter(r => isOngoing(r.post) && r.userVoteId != null);
      case "ended":
        return rows.filter(r => r.post.ended_at != null);
    }
  }, [rows, tab]);

  return (
    <>
      {/* Tabs */}
      {isMyPost ? (
        <PageHeader
          showDropdown={false}
          showBack={false}
          title="내 게시물"
        />
      ) : (
        <div className="w-full flex flex-row items-center justify-center mb-2">
        <ul className="w-full max-w-[453px]  flex flex-row bg-dark-900 rounded-full">
          <li className="flex-1/3">
            <button
              className={`text-[16px] w-full py-2 px-7 sm:px-9 rounded-full cursor-pointer ${
                tab === "ongoing" ? "bg-gray-600" : ""
              }`}
              onClick={() => setTab("ongoing")}
            >
              진행중
            </button>
          </li>
          <li className="flex-1/3">
            <button
              className={`text-[16px] w-full py-2 px-7 sm:px-9 rounded-full cursor-pointer ${
                tab === "participating" ? "bg-gray-600" : ""
              }`}
              onClick={() => setTab("participating")}
            >
              참여중
            </button>
          </li>
          <li className="flex-1/3">
            <button
              className={`text-[16px] w-full py-2 px-7 sm:px-9 rounded-full cursor-pointer ${
                tab === "ended" ? "bg-gray-600" : ""
              }`}
              onClick={() => setTab("ended")}
            >
              완료됨
            </button>
          </li>
        </ul>
      </div>
      ) }
      

      {/* Card List */}
      <div className="max-w-2xl mx-auto flex flex-col gap-4 py-4">
        {filtered.length !== 0 ? filtered.map(({ post, author, commentCount }) => (
          <Card
            key={post.id}
            postId={post.id}
            title={post.title}
            content={post.content}
            author_id={post.author_id}
            commentCount={commentCount}
            viewCount={2}
            option_a={post.option_a}
            option_b={post.option_b}
            votes_a={post.votes_a}
            votes_b={post.votes_b}
            is_end_vote={post.is_end_vote}
            created_at={post.created_at}
            author={{
              userId: author.id,
              display_name: author.displayName,
              sex: author.sex,
              mbti: author.mbti,
              birth_year: author.birthYear,
              age: author.age,
              job: author.job,
            }}
          />
        )) : (
          <p className="w-full text-center">해당 카테고리에 게시물이 없습니다.</p>
        )}
      </div>
    </>
  );
}
