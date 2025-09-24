import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import LogoMobile from "./component/shared/logoMobile";

import Navigation from "./component/shared/navigation";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "MinCho",
  description: "Ask questions and get answers from the community",
  openGraph: {
    title: "MinCho",
    description: "Ask questions and get answers from the community",
    url: "https://https://mincho.codibara.com/",
    siteName: "MinCho",
    images: [
      {
        url: "https://myapp.com/og-image.png",
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
