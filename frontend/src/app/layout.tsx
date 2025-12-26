import type { Metadata } from "next";
import "./globals.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/**
 * Next.js App Router のルートレイアウト
 * - 全ページ共通の <html> / <body> を定義
 * - Header / Footer をここで一括適用して「画面の統一感」を出す
 * - ここは基本サーバーコンポーネント（"use client" は不要）
 */
export const metadata: Metadata = {
    title: "Ms.Lingo",
    description: "あなたの英語学習パートナー",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            {/* bodyのクラスは globals.css / Tailwind の設計に合わせてOK */}
            <body>
                {/* 共通ヘッダ */}
                <Header />

                {/* ページ本体 */}
                {children}

                {/* 共通フッタ */}
                <Footer />
            </body>
        </html>
    );
}
