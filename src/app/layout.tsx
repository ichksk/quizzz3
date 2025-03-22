import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

import { GlobalLoading } from "@/components/loading";

import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700']
});


export const metadata: Metadata = {
  title: "クイズ大会メーカー",
  description: "クイズ大会メーカーは、誰でも簡単にクイズ大会を作成・運営できるオンラインツールです。イベントや授業をもっと楽しく。"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.className} antialiased`}
      >
        <div className="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
          <Toaster />
          <GlobalLoading />
          {children}
        </div>
      </body>
    </html>
  );
}
