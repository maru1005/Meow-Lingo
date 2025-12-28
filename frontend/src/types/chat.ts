// 1メッセージの型（APIと共有する前提）
export type ChatMessage = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

// APIレスポンス想定
export type ChatResponse = {
    reply: string;
};
