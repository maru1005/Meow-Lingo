// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./AuthProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Sidebar } from "@/components/features/chat/Sidebar"; 

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
                <AuthProvider>
                    {/* 1. ヘッダーは固定 */}
                    <Header />

                    {/* 2. サイドバーとメインコンテンツのコンテナ */}
                    <div className="flex-1 flex relative overflow-hidden">
                        {/* ここにサイドバーを配置！
                           未ログインなら Sidebar 内部の Zustand で user が null なら 
                           null を返すように作っておけば、ログイン前は表示されません。
                        */}
                        <Sidebar />

                        {/* 3. メインコンテンツエリア */}
                        <main className="flex-1 flex flex-col w-full overflow-hidden relative">
                            {/* 中央寄せにするためのラッパー。max-w-screen-md はここにつけます */}
                            <div className="flex-1 w-full max-w-screen-md mx-auto overflow-y-auto">
                                {children}
                            </div>
                        </main>
                    </div>

                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
}