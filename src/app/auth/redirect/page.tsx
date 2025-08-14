"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkUserProfileAndRedirect = async () => {
      if (status === "loading") return;

      if (!session?.user?.id) {
        // Not authenticated, redirect to login
        router.push("/login");
        return;
      }

      try {
        // Call our API to check user profile
        const response = await fetch("/api/auth/check-profile");
        const data = await response.json();

        if (data.redirectTo) {
          router.push(data.redirectTo);
        } else {
          // Fallback to settings
          router.push("/setting");
        }
      } catch (error) {
        console.error("Error checking user profile:", error);
        // Fallback to settings page on error
        router.push("/setting");
      } finally {
        setIsChecking(false);
      }
    };

    checkUserProfileAndRedirect();
  }, [session, status, router]);

  // Show loading state while checking
  if (status === "loading" || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main mx-auto mb-4"></div>
          <p className="text-gray-600">로그인 처리 중...</p>
        </div>
      </div>
    );
  }

  return null;
}
