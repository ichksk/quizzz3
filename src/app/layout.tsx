import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Toaster } from "react-hot-toast";

import { ConfirmRoot } from "@/components/confirm";
import { GlobalLoading } from "@/components/loading";
import { getCookie } from "@/server/cookies";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = await getCookie()
  console.log(cookie)
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.className} antialiased`}
      >
        <div className="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 ">
          <div className="min-h-[100dvh] px-4 py-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <ConfirmRoot />
            <Toaster
              position="top-right"
              toastOptions={{
                success: {
                  className: "bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold",
                  style: { padding: '16px', borderRadius: '8px' },
                },
                error: {
                  className: "bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold",
                  style: { padding: '16px', borderRadius: '8px' },
                },
              }}
            />
            <GlobalLoading />
            {children}
          </div>
        </div>
        <Script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`} crossOrigin="anonymous" />
      </body>
    </html>
  );
}
