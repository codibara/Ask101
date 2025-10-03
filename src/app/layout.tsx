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
    description: "Ask questions and get answers from the community",
    url: "https://mincho.codibara.com/",
    siteName: "MinCho",
    images: [
      {
        url: "https://mincho.codibara.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.e70350d0.png&w=384&q=75",
        width: 1200,
        height: 630,
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
