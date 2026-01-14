// src/types/chat.ts
export type MessageRole = "user" | "assistant";

export interface Message {
    role: MessageRole;
    content: string;
}

export interface ChatReplyResponse {
    reply: string;
    conversation_id: string;
    title?: string;
}