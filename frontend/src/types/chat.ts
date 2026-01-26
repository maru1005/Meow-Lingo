// src/types/chat.ts
export type MessageRole = "user" | "assistant";
export type ChatMode = "study" | "vocabulary" | "grammar" | "test";

// --- メッセージ ---
export interface Message {
    role: MessageRole;
    content: string;
    id?: string; // 一意な識別子（タイムスタンプまたはUUID）
}

// --- API リクエスト/レスポンス ---
export interface ChatRequest {
    message: string;
    conversation_id?: string | null;
    mode: ChatMode;
}

export interface ChatReplyResponse {
    reply: string;
    conversation_id: string | null;
    title?: string;
}

// --- 会話サマリー（履歴一覧・詳細用） ---
export interface MessageSummary {
    role: MessageRole;
    content: string;
}

export interface ConversationSummary {
    conversation_id: string;
    title: string;
    updated_at: string; // ISO 8601 date string
    mode: ChatMode;
    messages: MessageSummary[];
}

// --- Store State ---
export interface ChatState {
    messages: Message[];
    history: ConversationSummary[];
    currentMode: ChatMode;
    conversationId: string | null;
    isLoading: boolean;
    isSidebarOpen: boolean;
}