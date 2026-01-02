// src/app/AuthProvider.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const {loading } = useAuth();

    // Firebase 認証状態の初期化が終わるまで待つ
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Loading...
            </div>
        );
    }

    return <>{children}</>;
}