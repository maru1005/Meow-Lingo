// src/components/features/chat/ChatInput.tsx
"use client";

import { useState } from "react";
import { SendHorizontal, Loader2 } from "lucide-react";
import { useChatStore } from "./store/useChatStore";

export default function ChatInput() {
  const [text, setText] = useState("");
  const { sendMessage, isLoading } = useChatStore(); // Storeから呼び出し

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    
    const currentText = text;
    setText(""); // 入力欄を先にクリア（爆速UI体験）
    await sendMessage(currentText); // idTokenが必要な場合はlocalStorage等から取得
  };

  return (
    <div className="pt-2 pb-4 px-2">
      <form 
        onSubmit={handleSubmit} 
        className="relative flex items-center bg-neutral-900 border border-neutral-700 rounded-2xl p-1.5 shadow-2xl focus-within:ring-1 focus-within:ring-blue-500/50 transition-all"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
          placeholder={isLoading ? "コーチが考え中..." : "メッセージを入力..."}
          className="flex-1 bg-transparent px-4 py-2 text-sm text-white focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-700 text-white rounded-xl transition-all active:scale-95"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <SendHorizontal className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
}