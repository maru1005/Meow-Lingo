// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./AuthProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/Sidebar"; 

export const metadata: Metadata = {
    title: "Meow Lingo",
    description: "AI英語学習パートナー",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ja">
            <body className="bg-emerald-50 text-neutral-800 flex flex-col min-h-screen">
                <AuthProvider>
                    <Header />
                    <Sidebar />
                    <main className="flex-1 flex flex-col w-full overflow-hidden relative">
                        <div className="flex-1 w-full max-w-screen-md mx-auto">
                            {children}
                        </div>
                    </main>
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
}