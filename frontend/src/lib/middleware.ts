// frontend/src/lib/middleware.ts
/**
 * フロントエンド ミドルウェア設定
 * 認証、エラーハンドリング、ログなどを一元管理
 */

import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";

export class FrontendMiddleware {
  /**
   * API リクエストのインターセプター
   * - 認証トークン追加
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

    console.log(`🚀 [${method}] ${fullUrl}`);

    const res = await fetch(fullUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`❌ API Error ${res.status}: ${text}`);
      
      // ✅ ステータスコードを含むカスタムエラー
      const error = new Error(`API Error ${res.status}: ${text}`) as any;
      error.status = res.status;
      throw error;
    }

    return res.status === 204 ? ({} as T) : await res.json();
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
   */
  static handleError(error: Error): void {
    console.error("❌ Middleware Error:", error.message);
    // ここで全体的なエラー処理を実装
    if (error.message.includes("401")) {
      // 認証失敗時の処理
      useAuthStore.getState().logout();
    }
  }
}
