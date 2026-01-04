// src/components/features/chat/api/chatApi.ts
import { apiFetch } from "@/lib/api";
import { ChatReplyResponse, Message } from "@/types/chat";

// 履歴1件分の型（必要に応じて types/chat.ts に移動してください）
export interface ConversationSummary {
    conversation_id: string;
    title: string;
    updated_at: string;
}

// 会話詳細の型
export interface ConversationDetail {
    conversation_id: string;
    messages: Message[];
}

export const chatApi = {
    // 既存：チャット送信
    sendMessage: (message: string, idToken?: string | null) =>
        apiFetch<ChatReplyResponse>("/api/v1/chat/", { 
            method: "POST",
            body: JSON.stringify({ message }),
        }, idToken),

    // 既存：リセット
    reset: (idToken?: string | null) =>
        apiFetch<{ conversation_id: string }>("/api/v1/chat/reset", { 
            method: "POST" 
        }, idToken),

    // 追加：履歴一覧の取得
    getConversations: (idToken?: string | null) =>
        apiFetch<ConversationSummary[]>("/api/v1/chat/conversations", { 
            method: "GET" 
        }, idToken),

    // 追加：特定の会話内容の取得
    getConversationDetail: (conversationId: string, idToken?: string | null) =>
        apiFetch<ConversationDetail>(`/api/v1/chat/conversations/${conversationId}`, { 
            method: "GET" 
        }, idToken),
};