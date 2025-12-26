"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Header（モック認証版）
 * - Firebaseは使わない
 * - localStorage の mock_email があれば「ログイン中」扱い
 * - SSRとCSRの差で hydration error が出ないよう、最初は "mounted=false" にする
 */
export default function Header() {
    // ✅ SSR(サーバ)では localStorage が使えないので、マウント後にだけ読み込む
    const [mounted, setMounted] = useState(false);

    // ✅ mockログイン情報（メール）
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        const saved = window.localStorage.getItem("mock_email");
        setEmail(saved);
    }, []);

    // ✅ ログアウト：localStorage を消して /login へ
    const handleLogout = () => {
        window.localStorage.removeItem("mock_email");
        window.location.href = "/login";
    };

    // ✅ hydration回避：マウント前は固定表示にしてHTML差分を作らない
    if (!mounted) {
        return (
            <header className="sticky top-0 z-20 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
                <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
                    <Link href="/" className="font-semibold tracking-tight text-neutral-100">
                        Ms.Lingo
                    </Link>
                    <div className="text-xs text-neutral-400">Loading...</div>
                </div>
            </header>
        );
    }

    const isLoggedIn = !!email;

    return (
        <header className="sticky top-0 z-20 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
            <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
                {/* 左：ロゴ */}
                <Link href="/" className="font-semibold tracking-tight text-neutral-100">
                    Ms.Lingo
                </Link>

                {/* 右：ログイン状態 */}
                {isLoggedIn ? (
                    <div className="flex items-center gap-2">
                        <span className="max-w-[45vw] truncate text-xs text-neutral-300">
                            {email}
                        </span>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-neutral-100 hover:bg-neutral-900"
                        >
                            ログアウト
                        </button>
                    </div>
                ) : (
                    <Link
                        href="/login"
                        className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-neutral-100 hover:bg-neutral-900"
                    >
                        ログイン
                    </Link>
                )}
            </div>
        </header>
    );
}
