// frontend/src/components/layout/Header.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useChatStore } from "@/store/useChatStore";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import router from "next/router";

export default function Header() {
  const pathname = usePathname();
  const router =useRouter();
  const { toggleSidebar, currentMode } = useChatStore();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (pathname === "/login" || pathname === "/signup") return null;

const handleAuthAction = async () => {
    if (user) {
      // 1. ログイン中の場合：サインアウトして、完了を待ってから移動する
      try {
        await signOut(auth);
        // サインアウトに成功したら、ログイン画面（またはトップ）へ
        router.push("/login");
      } catch (error) {
        console.error("サインアウト失敗ニャ:", error);
      }
    } else {
      // 2. すでにログアウト済み（未ログイン）の場合：ログイン画面へ飛ばす
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-100 bg-emerald-50/90 backdrop-blur-md px-4 py-2">
      <div className="mx-auto flex max-w-2xl items-center justify-between">
        
        {/* 左側：メニュー ＆ ロゴ */}
        <div className="flex items-center gap-2">
          {/* ハンバーガーメニュー */}
          <button 
            onClick={toggleSidebar} 
            className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          
          {/* ロゴ画像へのリンク */}
          <Link href="/selection" className="flex items-center gap-2 group">
            <div className="relative h-8 w-28 transition-transform group-active:scale-95">
              <Image
                src="/images/logo-yoko.png" 
                alt="Meow Lingo"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* チャット中のモードバッジ */}
            {pathname === "/chat" && (
              <span className="hidden sm:block px-2 py-0.5 rounded-full bg-rose-100 text-[9px] font-black text-rose-500 uppercase tracking-tighter">
                {currentMode}
              </span>
            )}
          </Link>
        </div>

        {/* 右側：ログアウト */}
        <button 
          onClick={handleAuthAction} 
          className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs text-emerald-800 hover:bg-emerald-100"
        >
          {user ? "LOGOUT" : "LOGIN"} 
        </button>
      </div>
    </header>
  );
}