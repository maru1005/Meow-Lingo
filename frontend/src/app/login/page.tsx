// frontend/src/app/login/page.tsx
"use client";

import Image from "next/image";
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

    // OPENの世界観に寄せた“ふっくら入力欄”
    const pillInput =
        "w-full h-14 rounded-2xl px-5 text-sm text-neutral-900 placeholder:text-neutral-400 " +
        "bg-white/90 border border-rose-200/70 " +
        "shadow-[inset_0_2px_0_rgba(255,255,255,0.65),inset_0_-10px_18px_rgba(0,0,0,0.06),0_8px_16px_rgba(0,0,0,0.06)] " +
        "focus:border-rose-400 focus:outline-none transition";

    return (
        <main className="flex flex-1 flex-col bg-emerald-50 text-neutral-800">
            {/* 420px幅の“スマホ枠” */}
            <div className="mx-auto w-full max-w-[420px] px-5 pt-4 pb-10">
                {/* ロゴ */}
                <div className="mt-0 flex justify-center">
                    <Image
                        src="/images/logo-yoko.png"
                        alt="Meow Lingo"
                        width={320}
                        height={90}
                        priority
                    />
                </div>

                {/* メインビジュアル（猫）※フォームと同じ幅に揃える */}
                <div className="mx-auto mt-4 w-full max-w-[340px]">
                    <Image
                        src="/images/capsule-hello.png"
                        alt="Meow Lingo capsule cat"
                        width={340}
                        height={340}
                        priority
                    />
                </div>

                {/* フォーム：mt-auto をやめて、画面サイズで離れすぎない間隔にする */}
                <div className="mx-auto mt-[clamp(14px,3vh,24px)] w-full max-w-[340px]">
                    <div className="w-full rounded-3xl bg-white/80 p-6 shadow-md backdrop-blur border border-rose-100">
                        <div className="space-y-4">
                            {/* ID */}
                            <input
                                type="email"
                                placeholder="ID"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={pillInput}
                                inputMode="email"
                                autoComplete="email"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleLogin();
                                }}
                            />

                            {/* Password */}
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={pillInput}
                                autoComplete="current-password"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleLogin();
                                }}
                            />

                            {/* エラー */}
                            {error && <p className="text-sm text-rose-400">{error}</p>}

                            {/* ログインボタン（OPEN同型） */}
                            <div className="flex justify-center pt-1">
                                <button
                                    type="button"
                                    onClick={handleLogin}
                                    disabled={loading}
                                    aria-label="Login"
                                    className="
                    group relative inline-flex h-[56px] w-[280px]
                    items-center justify-center overflow-hidden rounded-full
                    disabled:cursor-not-allowed disabled:opacity-60
                  "
                                >
                                    {/* ふっくらベース（OPENと同じ） */}
                                    <span
                                        className="
                      absolute inset-0 rounded-full
                      bg-rose-400 shadow-md transition-all
                      group-active:scale-[0.98]
                    "
                                    />
                                    {/* 上側ハイライト（ツヤ） */}
                                    <span
                                        className="
                      absolute left-3 right-3 top-2 h-6 rounded-full
                      bg-white/30 blur-[0.5px]
                    "
                                    />
                                    {/* 下側の影（ふくらみ） */}
                                    <span
                                        className="
                      absolute inset-x-0 bottom-0 h-6 rounded-b-full
                      bg-rose-400/70 blur-[2px]
                    "
                                    />
                                    {/* 文字（OPEN寄せ） */}
                                    <span
                                        className="
                      relative z-10 text-[20px] font-extrabold
                      tracking-[0.35em] text-white
                      drop-shadow-[0_2px_0_rgba(0,0,0,0.25)]
                    "
                                        style={{ paddingLeft: "0.35em" }}
                                    >
                                        {loading ? "LOGIN" : "ログイン"}
                                    </span>
                                </button>
                            </div>

                            {/* 任意：説明 */}
                            {/* <p className="text-center text-xs text-neutral-400">IDはメールアドレスです</p> */}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
