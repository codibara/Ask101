"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PostList from "@/app/postList";
import type { PostListRow } from "@/app/page";

type ApiResponse = { items: PostListRow[]; nextCursor: { createdAt: Date; id: number } | null };

export default function PostListClient({
  initialRows,
  initialCursor,
}: {
  initialRows: PostListRow[];
  initialCursor: { createdAt: Date; id: number } | null;
}) {
  const [rows, setRows] = useState<PostListRow[]>(initialRows);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);
  const [errored, setErrored] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (!cursor || loading) return;
    setLoading(true);
    setErrored(null);
    try {
      const res = await fetch(
        `/api/posts?limit=10&cursor=${encodeURIComponent(JSON.stringify(cursor))}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ApiResponse = await res.json();
      setRows((prev) => [...prev, ...data.items]);
      setCursor(data.nextCursor);
    } catch (e: any) {
      setErrored(e?.message ?? "Failed to load more");
    } finally {
      setLoading(false);
    }
  }, [cursor, loading]);

  useEffect(() => {
    if (!sentinelRef.current || !cursor) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadMore();
    }, { rootMargin: "200px" });
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [cursor, loadMore]);

  return (
    <>
      <PostList rows={rows} isMyPost={false} />
      {/* Status / sentinel */}
      {errored && <div className="text-red-500 py-3">{errored}</div>}
      {cursor ? (
        <div ref={sentinelRef} className="py-6 text-center">
          {loading ? 
          (<svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="8"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
            className="opacity-75"
            fill="currentColor"
            d="M12 2a10 10 0 1 1-7.07 17.07l2.83-2.83A6 6 0 1 0 12 6V2z"
          />
          </svg>) : (<div></div>)
        }
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
