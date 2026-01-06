"use client"; // ✅ App Routerでは client側のhooks/useEffect/router/firebase を使うため必須

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase"; // ✅ Firebase auth を1箇所に集約したものを参照

import ChatHeader from "@/components/features/chat/ChatHeader";
import ChatMessageList from "@/components/features/chat/ChatMessageList";
import ChatInput from "@/components/features/chat/ChatInput";

export default function ChatPage() {
  const router = useRouter();

  // ✅ 認証状態の判定が終わるまで画面を出さないためのフラグ
  // （未ログイン時に一瞬チャットUIが見える“チラつき”防止）
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // ✅ Firebaseのログイン状態を購読（ログイン/ログアウトでコールバックが呼ばれる）
    const unsubscribe = onAuthStateChanged(
      auth,

      // --- 認証状態が取れたとき（成功時） ---
      (user) => {
        // ✅ 未ログインなら /login へ飛ばす（/chat 直打ち対策）
        if (!user) {
          router.replace("/login"); // 戻るボタンで /chat に戻りにくいよう replace を使う
          return;
        }

        // ✅ ログイン済みならチャット画面を表示してOK
        setChecking(false);
      },

      // --- 認証状態取得でエラーになったとき（例：env未設定など） ---
      (err) => {
        console.warn("onAuthStateChanged error:", err);

        // ✅ エラー時も安全側に倒して /login へ
        router.replace("/login");
      }
    );

    // ✅ コンポーネントが消える時に購読解除（メモリリーク防止）
    return () => unsubscribe();
  }, [router]);

  // ✅ 判定中は何も描画しない（チラつき防止）
  if (checking) return null;

  // ✅ 認証OK（ログイン済み）の場合だけチャットUIを描画
  return (
    <div
      className="
        flex flex-col flex-1
        bg-white/80
        backdrop-blur
        rounded-2xl
        shadow-sm
      "
    >
      <ChatHeader />
      <ChatMessageList />
      <ChatInput />
    </div>
  );
}
