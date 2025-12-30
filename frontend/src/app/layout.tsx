// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

// 【重要】ここをインポート！
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
    title: "Ms.Lingo",
    description: "あなたの英語学習パートナー",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="ja" className="dark">
            <body className="bg-neutral-950 text-neutral-100 flex flex-col min-h-screen">
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