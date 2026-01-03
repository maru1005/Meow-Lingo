// src/app/AuthProvider.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useChatStore } from "@/store/useChatStore";

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const {user, idToken, loading } = useAuth();

    useEffect(() => {
    // 💡 ログインが完了し、トークンが取得できている場合のみ履歴を取得
    if (!loading && user && idToken) {
      console.log("ログイン検知！履歴を取得するにゃ");
      fetchHistory(idToken);
    }
  }, [user, idToken, loading, fetchHistory]);

    return <>{children}</>;
}