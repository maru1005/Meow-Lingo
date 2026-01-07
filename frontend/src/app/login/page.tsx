// frontend/src/app/login/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        if (loading) return;

        setError(null);
        setLoading(true);

        try {
            await login(email, password);
            router.replace("/chat");
        } catch {
            setError("メールアドレスまたはパスワードが正しくありません");
        } finally {
            setLoading(false);
        }
    };

    // 入力欄：押しやすさを保ちつつ、縦も詰める
    const pillInput =
        "w-full h-11 rounded-2xl px-5 text-sm text-neutral-900 placeholder:text-neutral-400 " +
        "bg-white/90 border border-rose-200/70 " +
        "shadow-[inset_0_2px_0_rgba(255,255,255,0.65),inset_0_-10px_18px_rgba(0,0,0,0.06),0_8px_16px_rgba(0,0,0,0.06)] " +
        "focus:border-rose-400 focus:outline-none transition";

    return (
        <main className="flex-1 bg-emerald-50 text-neutral-800">
            {/* 420px幅の“スマホ枠” */}
            <div className="mx-auto w-full max-w-[420px] px-4 pt-5 pb-4">
                {/* ロゴ + ストーリー文 */}
                <div className="text-center">
                    <div className="mx-auto relative h-[min(90px,22vw)] w-[min(320px,82vw)]">
                        <Image
                            src="/images/logo-yoko.png"
                            alt="Meow Lingo"
                            fill
                            priority
                            className="object-contain"
                            sizes="(max-width: 420px) 82vw, 320px"
                        />
                    </div>

                    <p className="mt-1 text-xs text-emerald-700/90">
                        カプセルが開いたよ。ミャウと話そう🐾
                    </p>
                </div>

                {/* 猫：主役 */}
                <div className="mx-auto mt-3 relative h-[clamp(280px,78vw,360px)] w-[clamp(280px,78vw,360px)]">
                    <Image
                        src="/images/capsule-hello.png"
                        alt="Meow Lingo capsule cat"
                        fill
                        priority
                        className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.08)]"
                        sizes="(max-width: 420px) 78vw, 360px"
                    />
                </div>

                {/* フォーム */}
                <div className="mx-auto mt-[clamp(12px,2.4vh,18px)] w-full max-w-[340px]">
                    <div className="w-full rounded-3xl bg-white/80 p-5 shadow-md backdrop-blur border border-rose-100">
                        <form
                            className="space-y-3"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleLogin();
                            }}
                        >
                            {/* ID */}
                            <label className="sr-only" htmlFor="login-email">
                                ID
                            </label>
                            <input
                                id="login-email"
                                type="email"
                                placeholder="ID"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={pillInput}
                                inputMode="email"
                                autoComplete="email"
                            />

                            {/* Password */}
                            <label className="sr-only" htmlFor="login-password">
                                Password
                            </label>
                            <input
                                id="login-password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={pillInput}
                                autoComplete="current-password"
                            />

                            {/* エラー：固定枠でレイアウトを揺らさない */}
                            <div className="min-h-[18px]" aria-live="polite">
                                {error ? (
                                    <p className="text-xs text-rose-500 truncate">{error}</p>
                                ) : null}
                            </div>

                            {/* ログインボタン（OPEN同型：280×56） */}
                            <div className="flex justify-center pt-1">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    aria-label="Login"
                                    className="
                    group relative inline-flex h-[56px] w-[280px]
                    items-center justify-center overflow-hidden rounded-full
                    disabled:cursor-not-allowed disabled:opacity-60
                  "
                                >
                                    <span
                                        className="
                      absolute inset-0 rounded-full
                      bg-rose-400 shadow-md transition-all
                      group-active:scale-[0.98]
                    "
                                    />
                                    <span
                                        className="
                      absolute left-3 right-3 top-2 h-6 rounded-full
                      bg-white/30 blur-[0.5px]
                    "
                                    />
                                    <span
                                        className="
                      absolute inset-x-0 bottom-0 h-6 rounded-b-full
                      bg-rose-400/70 blur-[2px]
                    "
                                    />
                                    <span
                                        className="
                      relative z-10 text-[22px] font-extrabold
                      tracking-[0.45em] text-white
                      drop-shadow-[0_2px_0_rgba(0,0,0,0.25)]
                    "
                                        style={{ paddingLeft: "0.45em" }}
                                    >
                                        {loading ? "ログイン中…" : "ログイン"}
                                    </span>
                                </button>
                            </div>

                            {/* 戻る導線 */}
                            <div className="pt-2 text-center">
                                <Link
                                    href="/"
                                    className="text-xs text-emerald-700 underline underline-offset-4 hover:text-emerald-900"
                                >
                                    ← トップに戻る
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
