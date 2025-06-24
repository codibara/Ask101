"use client";

import { useSession, signOut } from "next-auth/react";

export default function SimpleLoggedInPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>로딩 중...</div>;
  }

  if (!session) {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-4">로그인 되었습니다!</h1>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
