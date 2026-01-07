"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

import ChatHeader from "@/components/features/chat/ChatHeader";
import ChatMessageList from "@/components/features/chat/ChatMessageList";
import ChatInput from "@/components/features/chat/ChatInput";

export default function ChatPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (!user) {
          router.replace("/login");
          return;
        }
        setChecking(false);
      },
      (err) => {
        console.warn("onAuthStateChanged error:", err);
        router.replace("/login");
      }
    );
    return () => unsubscribe();
  }, [router]);

  if (checking) return null;

  return (
    // ✅ 親（layoutのスクロール枠）いっぱいに伸ばす
    <div className="mx-auto h-full w-full max-w-[420px] px-4 py-3">
      <div
        className="
          flex h-full min-h-0 flex-col overflow-hidden
          rounded-2xl bg-white/80 backdrop-blur
          shadow-sm border border-emerald-100
        "
      >
        <ChatHeader />

        {/* ✅ メッセージだけスクロール */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <ChatMessageList />
        </div>

        {/* ✅ 入力欄は下に固定 */}
        <div className="shrink-0 border-t border-emerald-100 bg-white/60">
          <ChatInput />
        </div>
      </div>
    </div>
  );
}
