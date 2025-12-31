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
            content: "😊 今日の学習をはじめよう",
        },
    ]);

    // 【重要】会話の記憶（ID）を保持するState
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        // 1. ユーザーのメッセージを画面に表示
        const userMessage: Message = { id: crypto.randomUUID(), role: "user", content: text };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // 2. バックエンド API にリクエスト
            const response = await fetch("http://localhost:8000/api/v1/chat/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: text,
                    conversation_id: conversationId, // 保存されているIDを送信（初回はnull）
                }),
            });

            if (!response.ok) throw new Error("APIエラーが発生しました");

            const data = await response.json();

            // 3. AIの回答を画面に表示し、新しい conversation_id を保存する
            const aiMessage: Message = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: data.reply,
            };

            setMessages((prev) => [...prev, aiMessage]);
            setConversationId(data.conversation_id); // 【重要】これで記憶が繋がる

        } catch (error) {
            console.error("Chat Error:", error);
            const errorMessage: Message = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: "ごめんなさい、エラーが発生してしまいました。😭",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        messages,
        sendMessage,
        isLoading, // ローディング状態も返すとUIで使いやすいです
    };
}