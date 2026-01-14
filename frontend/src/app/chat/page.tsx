// src/app/chat/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore"; 
import ChatMessageList from "@/components/chat/ChatMessageList";
import ChatInput from "@/components/chat/ChatInput";
import Image from "next/image";

const MODE_SETTINGS = {
  study: { label: "FREE TALK MODE", color: "text-emerald-600/80" },
  vocabulary: { label: "VOCABULARY TRAINING", color: "text-blue-600/80" },
  grammar: { label: "GRAMMAR PRACTICE", color: "text-rose-600/80" },
  test: { label: "SKILL LEVEL TEST", color: "text-orange-600/80" },
};

export default function ChatPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  // 💡 selectConversation も追加で取り出すニャ
  const { initialGreeting, messages, currentMode, fetchHistory, conversationId, selectConversation, isLoading } = useChatStore();

  const settings = MODE_SETTINGS[currentMode] || MODE_SETTINGS.study;

  // 1. 認証チェックと履歴取得
  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }
    fetchHistory();
  }, [user, router, fetchHistory]);

  // 2. 💡 リロード復元 or 新規挨拶の判定ロジック
  useEffect(() => {
    if (!user || messages.length > 0 || isLoading) return;

    const restoreOrGreet = async () => {
      if (conversationId) {
        // A: ストレージにIDが残ってたら、その会話を復元する！
        console.log("履歴から復元するにゃ:", conversationId);
        await selectConversation(conversationId);
      } else {
        // B: IDがなければ、本当の新規なので挨拶する
        console.log("新規挨拶を開始するにゃ");
        await initialGreeting();
      }
    };
    restoreOrGreet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, conversationId]);

  if (!user) return null;

  return (
    <div className="mx-auto h-[calc(100vh-140px)] w-full max-w-[420px] px-4 py-3">
      <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-white/90 shadow-xl border border-emerald-100 backdrop-blur-sm">
        
        <div className="shrink-0 px-6 pt-4 pb-2">
          <div className={`inline-flex items-center gap-2 text-[12px] font-bold ${settings.color} tracking-widest transition-colors duration-300`}>
            <Image src="/images/footprints.png" alt="" width={14} height={14} />
            <span>{settings.label}</span>
          </div>
        </div>

        <div className="flex-1 min-h-0 flex-col flex">
          <ChatMessageList />
        </div>

        <div className="shrink-0 bg-white/50 border-t border-emerald-50">
          <ChatInput />
        </div>
      </div>
    </div>
  );
}