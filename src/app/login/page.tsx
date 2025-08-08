"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import IconButton from "../component/ui/loginButton";

export default function Navigation() {
  const { data: session, status } = useSession();

  const router = useRouter();

  return (
    <div className="mx-auto px-4 md:px-26">
      <div className="flex flex-row justify-center py-4">
        <div className="w-[328px] md:w-[484px] min-h-[calc(100svh-180px)] md:h-svh flex flex-col gap-6 md:justify-center md:items-center">
          <div className="flex-grow md:flex-none flex flex-col gap-4">
            <div className="md:hidden">Text</div>
            <p>로그인이 필요한 서비스 입니다.</p>
          </div>
          <div className="flex flex-col items-center gap-9">
            {status === "loading" ? (
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="h-8 w-8 rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-700">
                    {session.user?.name || session.user?.email}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3.5 w-full max-w-[328px]">
                <IconButton
                  text="Google 계정으로 계속하기"
                  onClick={() =>
                    signIn("google", { callbackUrl: "/auth/redirect" })
                  }
                  variant="primary"
                  isGoogle={true}
                  disabled={false}
                />
                <IconButton
                  text="로그인 없이 홈으로 돌아가기"
                  onClick={() => router.push("/")}
                  variant="secondary"
                  isGoogle={false}
                  disabled={false}
                />
              </div>
            )}
            <div className="flex flex-col gap-4 items-center">
              <p className="text-[10px]">
                로그인하시면 Codibara의{" "}
                <span className="font-semibold">이용약관</span>에 동의하는
                것으로 간주합니다.
              </p>
              <p className="text-[10px]">ⓒ 2025 Codibara</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
