"use client";

/**
 * 新規登録（モック）
 * - いまは登録APIが無いので「作った風」にして /login に戻す
 * - 後で POST /api/auth/signup へ差し替える
 */
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const canSubmit = useMemo(() => {
        return email.trim().length > 0 && password.trim().length >= 6;
    }, [email, password]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 本番はここで API 呼び出しに置換
        // await fetch("/api/auth/signup", ...)

        router.replace("/login");
    };

    return (
        <main className="min-h-[calc(100dvh-56px)] px-4 py-10">
            <div className="mx-auto w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-950/40 p-6 shadow-sm">
                <h1 className="text-xl font-semibold text-neutral-100">新規登録</h1>
                <p className="mt-1 text-sm text-neutral-400">
                    まずは仮の登録フォーム（後でAPIに差し替え）
                </p>

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs text-neutral-400">メールアドレス</label>
                        <input
                            className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-600"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            inputMode="email"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs text-neutral-400">
                            パスワード（6文字以上）
                        </label>
                        <input
                            className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-neutral-600"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            type="password"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        disabled={!canSubmit}
                        className="w-full rounded-xl bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 disabled:opacity-50"
                    >
                        登録する（モック）
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-neutral-400">
                    既にアカウントがある？{" "}
                    <a className="text-neutral-200 underline" href="/login">
                        ログイン
                    </a>
                </div>
            </div>
        </main>
    );
}
