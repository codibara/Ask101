import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import LogoMobile from "./component/shared/logoMobile";

import Navigation from "./component/shared/navigation";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "MinCho",
  description: "Ask questions and get answers from the community",
  icons: {
    icon: '/logo.png', // Path to your icon in the public directory
  },
  openGraph: {
    title: "MinCho",
    description: "민초는 치약이다 vs 아니다",
    url: "https://mincho.codibara.com/",
    siteName: "MinCho",
    images: [
      {
        url: "https://mincho.codibara.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmincho-new-log.58a73c13.png&w=256&q=75",
        width: 1000,
        height: 428,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-pretendard h-svh overflow-scroll">
        <LogoMobile />
        <SessionProvider>{children}</SessionProvider>
        <Navigation />
      </body>
    </html>
  );
}
