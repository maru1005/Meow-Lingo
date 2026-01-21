"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SignupPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // フォームバリデーション
    const errors = useMemo(() => {
        const msgs: string[] = [];
        
        if (email && !email.includes("@")) {
            msgs.push("有効なメールアドレスを入力してください");
        }
        
        if (password && password.length < 6) {
            msgs.push("パスワードは6文字以上である必要があります");
        }
        
        if (password && confirmPassword && password !== confirmPassword) {
            msgs.push("パスワードが一致しません");
        }
        
        return msgs;
    }, [email, password, confirmPassword]);

    const canSubmit = useMemo(() => {
        return (
            email.trim().length > 0 &&
            password.trim().length >= 6 &&
            confirmPassword.trim().length >= 6 &&
            password === confirmPassword &&
            errors.length === 0
        );
    }, [email, password, confirmPassword, errors]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;

        setError(null);
        setLoading(true);

        try {
            // 🔐 Firebase で新規登録
            await createUserWithEmailAndPassword(auth, email, password);

            // 登録成功後、チャット選択ページへ
            router.replace("/selection");
        } catch (err: any) {
            let errorMessage = "登録に失敗しました";

            if (err.code === "auth/email-already-in-use") {
                errorMessage = "このメールアドレスは既に登録されています";
            } else if (err.code === "auth/weak-password") {
                errorMessage = "より強力なパスワードを設定してください";
            } else if (err.code === "auth/invalid-email") {
                errorMessage = "有効なメールアドレスを入力してください";
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-[calc(100dvh-56px)] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-[400px]">
                {/* ロゴ */}
                <div className="mb-8 text-center">
                    <div className="mx-auto relative h-[60px] w-[200px]">
                        <Image
                            src="/images/logo-yoko.png"
                            alt="Meow Lingo"
                            fill
                            priority
                            sizes="200px"
                            className="object-contain"
                        />
                    </div>
                </div>

                {/* フォーム */}
                <div className="rounded-3xl border border-emerald-100 bg-white/90 p-8 shadow-xl backdrop-blur-sm">
                    <h1 className="text-2xl font-bold text-emerald-900">新規登録</h1>
                    <p className="mt-2 text-sm text-emerald-600">
                        Meow Lingo で楽しく英語を学ぼう！
                    </p>

                    {/* エラーメッセージ */}
                    {error && (
                        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                            ❌ {error}
                        </div>
                    )}

                    {/* バリデーションエラー */}
                    {errors.length > 0 && (
                        <div className="mt-4 space-y-2">
                            {errors.map((err, i) => (
                                <div key={i} className="text-xs text-red-600 flex items-start gap-2">
                                    <span className="mt-0.5">⚠️</span>
                                    <span>{err}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="mt-6 space-y-4">
                        {/* メールアドレス */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-emerald-900">
                                メールアドレス
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                placeholder="you@example.com"
                                className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-emerald-900 placeholder-emerald-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                                disabled={loading}
                            />
                        </div>

                        {/* パスワード */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-emerald-900">
                                パスワード（6文字以上）
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 pr-10 text-emerald-900 placeholder-emerald-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 hover:text-emerald-700 text-sm"
                                >
                                    {showPassword ? "隠す" : "表示"}
                                </button>
                            </div>
                        </div>

                        {/* パスワード確認 */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-emerald-900">
                                パスワード（確認）
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                                placeholder="••••••••"
                                className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-emerald-900 placeholder-emerald-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                                disabled={loading}
                            />
                        </div>

                        {/* 登録ボタン */}
                        <button
                            type="submit"
                            disabled={!canSubmit || loading}
                            className="w-full rounded-xl bg-emerald-500 py-3 font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="animate-spin">⏳</span>
                                    登録中...
                                </span>
                            ) : (
                                "登録する"
                            )}
                        </button>
                    </form>

                    {/* ログインへのリンク */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-emerald-700">
                            既にアカウントがある？{" "}
                            <Link
                                href="/login"
                                className="font-semibold text-emerald-600 hover:text-emerald-700 underline underline-offset-2"
                            >
                                ログインする
                            </Link>
                        </p>
                    </div>

                    {/* 利用規約など */}
                    <p className="mt-4 text-xs text-center text-emerald-600">
                        登録することで、利用規約に同意します
                    </p>
                </div>

                {/* 猫キャラ（オプション） */}
                <div className="mt-8 text-center opacity-50">
                    <p className="text-sm text-emerald-600">
                        🐱 Meow があなたをお待ちしています...
                    </p>
                </div>
            </div>
        </main>
    );
}
