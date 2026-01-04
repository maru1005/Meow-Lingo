// frontend/src/app/login/page.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    // ID=メールアドレスとして扱う（UIはID表記）
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setError(null);
        setLoading(true);

        try {
            await login(email, password);
            router.push("/chat");
        } catch {
            setError("メールアドレスまたはパスワードが正しくありません");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-emerald-50 text-neutral-800">
            {/* 420px幅の“スマホ枠” */}
            <div className="mx-auto flex min-h-screen max-w-[420px] flex-col px-5 pt-8 pb-10">
                {/* 上部：ロゴ＋カプセル */}
                <div className="flex flex-col items-center">
                    {/* ロゴ */}
                    <div className="mt-2 flex justify-center">
                        <Image
                            src="/images/logo-yoko.png"
                            alt="Meow Lingo"
                            width={320}
                            height={90}
                            priority
                        />
                    </div>

                    {/* メインビジュアル */}
                    <div className="mt-6 w-full max-w-[340px]">
                        <Image
                            src="/images/capsule-hello.png"
                            alt="Meow Lingo capsule cat"
                            width={340}
                            height={340}
                            priority
                        />
                    </div>
                </div>

                {/* 下部：フォーム（下寄せ） */}
                <div className="mt-auto">
                    <div className="w-full rounded-3xl bg-white/80 p-6 shadow-md backdrop-blur">
                        <div className="space-y-4">
                            {/* ID */}
                            <input
                                type="email"
                                placeholder="ID"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-2xl border border-emerald-100 bg-white/90 p-4 text-sm text-neutral-900 outline-none transition-all focus:border-neutral-600 focus:outline-none"
                            />

                            {/* Password */}
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-2xl border border-emerald-100 bg-white/90 p-4 text-sm text-neutral-900 outline-none transition-all focus:border-neutral-600 focus:outline-none"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleLogin();
                                }}
                            />

                            {/* エラー */}
                            {error && (
                                <p className="text-sm text-rose-400">{error}</p>
                            )}

                            {/* ログインボタン（/3000 の “ふっくら丸” と同型） */}
                            <button
                                type="button"
                                onClick={handleLogin}
                                disabled={loading}
                                className="group relative mx-auto mt-2 inline-flex h-[56px] w-[280px] items-center justify-center overflow-hidden rounded-full disabled:opacity-50"
                                aria-label="ログイン"
                            >
                                {/* ふっくら背景 */}
                                <span className="absolute inset-0 rounded-full bg-rose-400 shadow-md transition-all group-active:scale-[0.98]" />
                                {/* ほんのりハイライト（斜め2枚） */}
                                <span className="absolute inset-0 rounded-full bg-white/20 [clip-path:polygon(0_0,0_100%,100%_0)]" />
                                <span className="absolute inset-0 rounded-full bg-white/10 [clip-path:polygon(0_0,100%_100%,100%_0)]" />

                                {/* ラベル（画像は使わない） */}
                                <span className="relative z-10 text-lg font-extrabold tracking-wider text-white shadow-sm">
                                    {loading ? "ログイン中..." : "ログイン"}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
