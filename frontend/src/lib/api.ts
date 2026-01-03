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

    // 🔑 Firebase ID Token を取得
    const user = auth.currentUser;
    if (user) {
        const idToken = await user.getIdToken();
        headers.set("Authorization", `Bearer ${idToken}`);
    }

    console.log(`Requesting to: ${API_BASE_URL}${path}`);

    const res = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`API Error ${res.status}: ${text || res.statusText}`);
    }
    
    return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}