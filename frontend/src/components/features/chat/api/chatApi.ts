// src/components/features/chat/api/chatApi.ts
import { apiFetch } from "@/lib/api";
import { ChatReplyResponse } from "@/types/chat";

export const chatApi = {
    // ジェネリクス <ChatReplyResponse> を追加して型を確定させる
    sendMessage: (message: string, idToken?: string | null) =>
        apiFetch<ChatReplyResponse>("/api/v1/chat/", { 
            method: "POST",
            body: JSON.stringify({ message }),
        }, idToken),

    reset: (idToken?: string | null) =>
        apiFetch<{ conversation_id: string }>("/api/v1/chat/reset", { 
            method: "POST" 
        }, idToken),
};