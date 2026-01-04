// src/lib/api.ts
import { auth } from "@/lib/firebase";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export async function apiFetch<T>(
    path: string,
    init: RequestInit = {},
    idToken?: string | null
): Promise<T> {
    const headers = new Headers(init.headers);
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");

    // 🔑 トークン取得をより確実にする
    const user = auth.currentUser;
    if (user) {
        try {
            const token = await user.getIdToken(true); // 強制リフレッシュ
            headers.set("Authorization", `Bearer ${token}`);
            console.log("🔑 Token attached to request");
        } catch (e) {
            console.error("トークン取得失敗だニャ:", e);
        }
    }

    // パスの先頭に / が重複しないように調整
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const fullUrl = `${API_BASE_URL}${cleanPath}`;

    console.log(`🚀 Requesting to: ${fullUrl}`);

    try {
        const res = await fetch(fullUrl, { ...init, headers });

        if (!res.ok) {
            const text = await res.text().catch(() => "");
            console.error(`❌ APIエラー詳細: ${res.status}`, text);
            throw new Error(`API Error ${res.status}: ${text}`);
        }
        
        return res.status === 204 ? (undefined as T) : (await res.json());
    } catch (err) {
        console.error("🚨 fetchそのものが失敗したニャ（ネットワークエラー等）:", err);
        throw err;
    }
}