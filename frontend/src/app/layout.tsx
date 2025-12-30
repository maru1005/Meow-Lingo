// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

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
        <html lang="ja">
            <body className="bg-neutral-900 text-neutral-100">
                <Header />
                <main className="mx-auto max-w-screen-sm">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
