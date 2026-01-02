"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    // 一旦はシンプルに state を持つ
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setError(null);
        setLoading(true);
        
        try {
            // 🔐 Firebase Authentication
            await login(email,password);

             // ✅ ログイン成功 → chatへ
            router.push("/chat");
        } catch (err) {
            setError("メールアドレスまたはパスワードが正しくありません");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto min-h-screen max-w-[420px] px-5 pt-10">
            <div className="w-full rounded-2xl bg-white p-6 shadow-md">
                <h1 className="mb-4 text-lg font-semibold text-gray-900">ログイン</h1>

                {/* メールアドレス */}
                <input
                    type="email"
                    placeholder="メールアドレス"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-3 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm"
                />

                <input
                    type="password"
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-4 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm"
                />

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full rounded-xl bg-blue-600 py-3 text-sm font-medium text-white"
                >
                    {loading ? "ログイン中..." : "ログイン"}
                </button>
            </div>
        </div>
    );
}
