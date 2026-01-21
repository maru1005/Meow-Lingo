// src/lib/api.ts
/**
 * API呼び出しの統一インターフェース
 * FrontendMiddleware を利用
 */
import { FrontendMiddleware } from "@/lib/middleware";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export async function apiFetch<T>(
  path: string,
  method: "GET" | "POST" | "DELETE" | "PUT",
  body?: any
): Promise<T> {
  return FrontendMiddleware.apiFetch<T>(path, method, body);
}