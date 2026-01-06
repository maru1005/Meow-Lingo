// frontend/src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function HomePage() {
    const [checking, setChecking] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            (u) => {
                setUser(u);
                setChecking(false);
            },
            (err) => {
                console.warn("onAuthStateChanged error:", err);
                setUser(null);
                setChecking(false);
            }
        );
        return () => unsubscribe();
    }, []);

    // 判定中はOPENの行き先がブレるので一旦描画しない（0.2秒くらい）
    if (checking) return null;

    const openHref = user ? "/chat" : "/login";

    return (
        <main className="w-full bg-emerald-50 text-neutral-800">
            <div className="mx-auto w-full max-w-[420px] px-5 pt-8 pb-10">
                <p className="text-center text-sm text-neutral-500">1日1分から学ぶ英語</p>

                <div className="mt-4 flex justify-center">
                    <Image
                        src="/images/logo-yoko.png"
                        alt="Meow Lingo"
                        width={320}
                        height={90}
                        priority
                    />
                </div>

                <div className="relative mx-auto mt-6 w-full max-w-[340px]">
                    <Image
                        src="/images/capsule.png"
                        alt="Meow Lingo capsule cat"
                        width={340}
                        height={340}
                        priority
                    />
                    <div className="absolute -right-1 -top-3 w-[170px]">
                        <Image
                            src="/images/speech.png"
                            alt="Let's start learning!"
                            width={170}
                            height={110}
                            priority
                        />
                    </div>
                </div>

                <p className="mt-10 text-center text-sm tracking-wider text-neutral-500">
                    カプセルを開けよう
                </p>

                {/* OPENボタン：ログイン状態で行き先を切り替える */}
                <div className="mt-4 flex justify-center">
                    <Link
                        href={openHref}
                        aria-label="Open"
                        className="group relative inline-flex h-[56px] w-[280px] items-center justify-center overflow-hidden rounded-full"
                    >
                        <span className="absolute inset-0 rounded-full bg-rose-400 shadow-md transition-all group-active:scale-[0.98]" />
                        <span className="absolute left-3 right-3 top-2 h-6 rounded-full bg-white/30 blur-[0.5px]" />
                        <span className="absolute inset-x-0 bottom-0 h-6 rounded-b-full bg-rose-400/70 blur-[2px]" />

                        <span
                            className="relative z-10 text-[22px] font-extrabold tracking-[0.45em] text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.25)]"
                            style={{ paddingLeft: "0.45em" }}
                        >
                            OPEN
                        </span>
                    </Link>
                </div>

                {/* デバッグ用（必要なら表示） */}
                {/* <p className="mt-4 text-center text-xs text-neutral-400">
          {user ? "ログイン済み" : "未ログイン"}
        </p> */}
            </div>
        </main>
    );
}
