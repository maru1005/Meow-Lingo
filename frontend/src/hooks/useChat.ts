// frontend/src/hooks/useChat.ts
"use client";

import { useState } from "react";

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

    const sendMessage = (text: string) => {
        if (!text.trim()) return;

        setMessages((prev) => [
            ...prev,
            { id: crypto.randomUUID(), role: "user", content: text },
            {
                id: crypto.randomUUID(),
                role: "assistant",
                content: `（mock）「${text}」について説明します。`,
            },
        ]);
    };

    return {
        messages,
        sendMessage,
    };
}