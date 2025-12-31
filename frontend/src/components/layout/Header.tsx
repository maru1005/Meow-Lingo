// frontend/src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const saved = window.localStorage.getItem("mock_email");
    setEmail(saved);
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("mock_email");
    window.location.href = "/login";
  };

  // SSR / hydration 対策
  if (!mounted) {
    return (
      <header className="sticky top-0 z-20 border-b border-emerald-200 bg-emerald-50/80 backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="font-semibold tracking-tight text-emerald-900"
          >
            Meow Lingo
          </Link>
          <div className="text-xs text-emerald-600">Loading...</div>
        </div>
      </header>
    );
  }

  const isLoggedIn = !!email;

  return (
    <header className="sticky top-0 z-20 border-b border-emerald-200 bg-emerald-50/80 backdrop-blur">
      <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
        {/* ロゴ */}
        <Link
          href="/"
          className="font-semibold tracking-tight text-emerald-900"
        >
          Meow Lingo
        </Link>

        {/* 右側 */}
        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            <span className="max-w-[45vw] truncate text-xs text-emerald-700">
              {email}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs text-emerald-800 hover:bg-emerald-100"
            >
              ログアウト
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs text-emerald-800 hover:bg-emerald-100"
          >
            ログイン
          </Link>
        )}
      </div>
    </header>
  );
}