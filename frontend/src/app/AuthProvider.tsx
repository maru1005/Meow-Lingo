// src/app/AuthProvider.tsx
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { FrontendMiddleware } from "@/lib/middleware";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { loading } = useAuthStore();

    useEffect(() => {
        // ✅ ミドルウェアから認証初期化
        FrontendMiddleware.initAuth();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-emerald-600 font-bold">
                Loading Meow Lingo...
            </div>
        );
    }
    return <>{children}</>;
}