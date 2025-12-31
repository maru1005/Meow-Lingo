// frontend/src/types/chat.ts

export type MessageRole = "user" | "assistant";

export interface Message {
    // id はフロントエンド側で一時的に振るか、無ければオプショナルにします
    id?: string; 
    role: MessageRole;
    content: string;
}

// バックエンドからの返却値（chatApi.ts や useChatStore.ts で使用）
export interface ChatReplyResponse {
    reply: string;
    conversation_id: string;
}

// 履歴取得時の型（もし使うなら）
export interface Conversation {
    conversation_id: string;
    created_at: string;
    messages: Message[];
}