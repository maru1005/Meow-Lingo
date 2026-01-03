"use client";

/**
 * 新規登録（Firebase Authentication）
 * - Email / Password でユーザー作成
 * - 成功後は /chat へ遷移
 *
 * 認証ロジックは useAuth（Zustand）に集約している
 */
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function SignupPage() {
    const router = useRouter();
    const { signup } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

     // フォームの簡易バリデーション
    const canSubmit = useMemo(() => {
        return email.trim().length > 0 && password.trim().length >= 6;
    }, [email, password]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;

        setError(null);
        setLoading(true);

        try {
            // 🔐 Firebase Authentication（新規登録）
            await signup(email, password);

            // 登録後はそのままログイン状態 → chatへ
            router.replace("/login");
        } catch (err) {
            setError("登録に失敗しました（メールアドレス・パスワードをご確認ください）");
        } finally {
            setLoading(false);
        }    
    };

    return (
        <main className="min-h-[calc(100dvh-56px)] px-4 py-10">
            <div className="mx-auto w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-950/40 p-6 shadow-sm">
                <h1 className="text-xl font-semibold text-neutral-100">新規登録</h1>
                <p className="mt-1 text-sm text-neutral-400">
                    メールアドレスとパスワードで登録できます
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
                        {loading ? "登録中..." : "登録する"}
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
