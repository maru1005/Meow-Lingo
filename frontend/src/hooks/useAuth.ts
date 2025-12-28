// src/hooks/useChat.ts
"use client";

import { useState } from "react";

/**
 * チャット1件の型
 * role は backend の messages.role と合わせている
 */
export type ChatMessage = {
    role: "user" | "assistant";
    content: string;
};

/**
 * 🔌 将来ここを API に差し替える
 * POST /api/chat
 */
export function useChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: "assistant",
            content: "こんにちは！英語の質問をどうぞ 😊",
        },
    ]);

    /**
     * 送信処理（今はモック）
     */
    const sendMessage = async (text: string) => {
        // ユーザー発言を追加
        setMessages((prev) => [
            ...prev,
            { role: "user", content: text },
        ]);

        // ⏳ APIモック
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: `（mock）「${text}」について説明します。`,
                },
            ]);
        }, 600);
    };

    return {
        messages,
        sendMessage,
    };
}
