// frontend/src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useChatStore } from "@/store/useChatStore";

export default function Header() {
  // チームの作った auth と store から必要なものだけ抜く
  const { user, logout, loading } = useAuth();
  const toggleSidebar = useChatStore((state) => state.toggleSidebar);

  // 1. ローディング中（認証状態確認中）の表示
  // これにより useEffect + setMounted(true) の代わりになります
  if (loading) {
    return (
      <header className="sticky top-0 z-40 border-b border-emerald-200 bg-emerald-50/80 backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
          <div className="font-semibold text-emerald-900">Meow Lingo</div>
          <div className="text-xs text-emerald-600 animate-pulse">Loading...</div>
        </div>
      </header>
    );
  }

  // 2. 認証確認後の表示
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-200 bg-emerald-50/80 backdrop-blur">
      <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
        
        {/* 左側：ハンバーガー + ロゴ */}
        <div className="flex items-center gap-3">
          {user && (
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md hover:bg-emerald-100 text-emerald-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
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
              <span className="hidden sm:inline-block max-w-[100px] truncate text-xs text-emerald-700">
                {user.email}
              </span>
              <button
                type="button"
                onClick={logout}
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