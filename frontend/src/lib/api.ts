// src/lib/api.ts
// フロントからの API 通信は「ここだけ」を通す（設計ルール）
// - 直接 fetch を各コンポーネントに書かない
// - Firebase ID Token があれば Authorization に載せる

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

/**
 * APIにリクエストする共通関数
 * @param path `/api/chat` のように先頭スラッシュ付きで渡す
 * @param init fetch のオプション
 * @param idToken Firebase ID Token（ログイン時に取得）
 */
export async function apiFetch<T>(
    path: string,
    init: RequestInit = {},
    idToken?: string | null
): Promise<T> {
    const headers = new Headers(init.headers);

    // JSON送信が多いのでデフォルト設定（すでに指定があれば尊重）
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");

    // ログイン済みなら Bearer を付ける（バックが Firebase 検証する前提）
    if (idToken) headers.set("Authorization", `Bearer ${idToken}`);

    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers,
    });

    // エラー時のメッセージを取りやすくする
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`API Error ${res.status}: ${text || res.statusText}`);
    }

    // 204 No Content など JSONが無い場合にも対応
    if (res.status === 204) return undefined as T;

    return (await res.json()) as T;
}

// ここから下は「便利ショートカット」：チームが繋ぎやすいように型を揃える

export type ChatReplyResponse = {
    reply: string;
    conversation_id: string;
};

export async function postChatMessage(message: string, idToken?: string | null) {
    return apiFetch<ChatReplyResponse>(
        "/api/chat",
        {
            method: "POST",
            body: JSON.stringify({ message }),
        },
        idToken
    );
}

export async function postChatReset(idToken?: string | null) {
    return apiFetch<{ conversation_id: string }>(
        "/api/chat/reset",
        { method: "POST" },
        idToken
    );
}

export async function getConversations(idToken?: string | null) {
    return apiFetch<{
        conversations: Array<{
            conversation_id: string;
            created_at: string;
            messages: Array<{ role: "user" | "assistant"; content: string }>;
        }>;
    }>("/api/conversations", { method: "GET" }, idToken);
}

export async function getMe(idToken?: string | null) {
    return apiFetch<{
        firebase_uid: string;
        email: string | null;
        created_at: string;
    }>("/api/auth/me", { method: "GET" }, idToken);
}
