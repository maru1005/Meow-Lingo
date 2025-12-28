"use client";

import { useState } from "react";

/**
 * チャット1件分の型
 * ※ API担当がこの形で返す想定
 */
export type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "こんにちは 😊 英語の質問をどうぞ。",
        },
    ]);

    /**
     * 送信（仮）
     * → 後で API 呼び出しに差し替える
     */
    const sendMessage = (text: string) => {
        if (!text.trim()) return;

        setMessages((prev) => [
            ...prev,
            { id: crypto.randomUUID(), role: "user", content: text },
            {
                id: crypto.randomUUID(),
                role: "assistant",
                content: "（ここにAIの返答が入ります）",
            },
        ]);
    };

    return {
        messages,
        sendMessage,
    };
}
