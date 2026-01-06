// frontend/src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";

import AuthProvider from "./AuthProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// ✅ スマホ実寸
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
};

export const metadata: Metadata = {
    title: "Meow Lingo",
    description: "あなたの英語学習パートナー",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="ja">
            <body className="bg-emerald-50 text-neutral-800 flex min-h-screen flex-col">
                <AuthProvider>
                    <Header />

                    {/* ✅ 420pxのスマホ枠。スクロールはこの中で */}
                    <main className="flex-1 w-full overflow-hidden">
                        <div className="mx-auto h-full w-full max-w-[420px] overflow-y-auto">
                            {children}
                        </div>
                    </main>

                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
}
