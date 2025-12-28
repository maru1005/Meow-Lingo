"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const handleLogin = () => {
        // ✅ 仮ログイン情報を保存
        localStorage.setItem("mock_email", "test@example.com");

        // ✅ chatへ
        router.push("/chat");
    };

    return (
        <div className="mx-auto max-w-screen-sm px-4 py-10">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6">
                <h1 className="mb-4 text-lg font-semibold">ログイン（仮）</h1>

                <button
                    onClick={handleLogin}
                    className="w-full rounded-xl bg-blue-600 py-3 text-sm font-medium"
                >
                    仮ログインする
                </button>
            </div>
        </div>
    );
}
