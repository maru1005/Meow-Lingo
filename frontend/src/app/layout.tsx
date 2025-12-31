// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

// 【重要】ここをインポート！
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
    title: "Meow Lingo",
    description: "あなたの英語学習パートナー",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="ja">
            <body className="bg-emerald-50 text-neutral-800 flex flex-col min-h-screen">
                <Header />
                {/* flex-1 を入れることで、メインが余ったスペースを全部埋めます */}
                <main className="flex-1 flex flex-col w-full max-w-screen-md mx-auto overflow-hidden">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}