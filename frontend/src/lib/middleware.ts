// frontend/src/lib/middleware.ts
/**
 * フロントエンド ミドルウェア設定
 * 認証、エラーハンドリング、ログなどを一元管理
 */

import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";

// タイムアウト時間（ミリ秒）
// チャットはOpenAI呼び出しがあるため長め、それ以外は短め
const TIMEOUT_MS: Record<string, number> = {
  POST: 30000, // 30秒（LLM応答待ちがある）
  GET: 10000,  // 10秒
  DELETE: 10000,
  PUT: 10000,
};

export class ApiTimeoutError extends Error {
  constructor() {
    super("リクエストがタイムアウトしました");
    this.name = "ApiTimeoutError";
  }
}

export class FrontendMiddleware {
  /**
   * API リクエストのインターセプター
   * - 認証トークン追加
   * - タイムアウト（AbortController）
   * - エラーハンドリング
   */
  static async apiFetch<T>(
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

    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    const fullUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${cleanPath}`;

    // AbortController でタイムアウト制御
    const controller = new AbortController();
    const timeoutMs = TIMEOUT_MS[method] ?? 15000;
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(fullUrl, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error(`❌ API Error ${res.status}: ${text}`);

        const error = new Error(`API Error ${res.status}: ${text}`) as any;
        error.status = res.status;
        throw error;
      }

      return res.status === 204 ? ({} as T) : await res.json();

    } catch (err: any) {
      // AbortController によるタイムアウト
      if (err.name === "AbortError") {
        throw new ApiTimeoutError();
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * 認証ミドルウェア
   * - ページ読み込み時に認証を初期化
   */
  static async initAuth(): Promise<void> {
    const { initAuth } = useAuthStore.getState();
    await initAuth();
  }

  /**
   * エラーハンドラー
   * - 401 は自動ログアウト
   * - タイムアウトはその旨を返す
   */
  static handleError(error: any): string {
    if (error instanceof ApiTimeoutError) {
      return "通信がタイムアウトしました。再度お試しください。";
    }
    if (error?.status === 401) {
      useAuthStore.getState().logout();
      return "セッションが切れました。再ログインしてください。";
    }
    console.error("❌ Middleware Error:", error?.message);
    return "エラーが発生しました。再度お試しください。";
  }
}