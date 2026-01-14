// src/lib/api.ts
import { auth } from "@/lib/firebase";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export async function apiFetch<T>(
    path: string,
    method: "GET" | "POST" | "DELETE" | "PUT",
    body?: any
): Promise<T> {
    const user = auth.currentUser;
    const token = user ? await user.getIdToken() : null;
    
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const fullUrl = `${API_BASE_URL}/${cleanPath}`;
    
    console.log(`🚀 APIリクエスト送信先: [${method}] ${fullUrl}`);

    const res = await fetch(fullUrl, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`API Error ${res.status}: ${text}`);
    }
    
    // 204 No Content の時は空のオブジェクト、それ以外はJSONを返す
    return res.status === 204 ? ({} as T) : await res.json();
}