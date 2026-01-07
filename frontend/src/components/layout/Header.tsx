// frontend/src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useChatStore } from "@/store/useChatStore";

export default function Header() {
  const pathname = usePathname();

  // ✅ /login ではヘッダーを出さない
  if (pathname === "/login") return null;
  // 必要なら signup も
  // if (pathname === "/login" || pathname === "/signup") return null;

  // チームの作った auth と store から必要なものだけ抜く
  const { user, logout, loading } = useAuth();
  const toggleSidebar = useChatStore((state) => state.toggleSidebar);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      console.log("👋 ログアウトしたにゃー。トップへ！");
      router.push("/");
    } catch (error) {
      console.error("ログアウト失敗:", error);
    }
  };

  // ローディング中（認証状態確認中）
  if (loading) {
    return (
      <header className="sticky top-0 z-40 border-b border-emerald-200 bg-emerald-50/80 backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
          <div className="font-semibold text-emerald-900">Meow Lingo</div>
          <div className="animate-pulse text-xs text-emerald-600">Loading...</div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-200 bg-emerald-50/80 backdrop-blur">
      <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
        {/* 左側：ハンバーガー + ロゴ */}
        <div className="flex items-center gap-3">
          {user && (
            <button
              type="button"
              onClick={toggleSidebar}
              className="rounded-md p-1 text-emerald-800 transition-colors hover:bg-emerald-100"
              aria-label="Toggle sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          )}

          <Link href="/" className="font-semibold tracking-tight text-emerald-900">
            Meow Lingo
          </Link>
        </div>

        {/* 右側：ユーザー情報 or ログインボタン */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden max-w-[100px] truncate text-xs text-emerald-700 sm:inline-block">
                {user.email}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs text-emerald-800 hover:bg-emerald-100"
              >
                ログアウト
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs text-emerald-800 hover:bg-emerald-100"
            >
              ログイン
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
