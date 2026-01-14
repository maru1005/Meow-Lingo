// src/components/features/chat/ChatInput.tsx
"use client";

import { useState } from "react";
import { SendHorizontal, Loader2 } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";

export default function ChatInput() {
  const [text, setText] = useState("");
  const { sendMessage, isLoading } = useChatStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;

    const currentText = text;
    setText("");
    await sendMessage(currentText);
  };

  return (
    <div className="pt-2 pb-4 px-2">
      <form
        onSubmit={handleSubmit}
        className="
          relative flex items-center
          bg-white/80 border border-emerald-200
          rounded-2xl p-1.5
          shadow-sm backdrop-blur
          focus-within:ring-1 focus-within:ring-emerald-400/50
          transition-all
        "
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
          placeholder={isLoading ? "Meowが考え中にゃ…" : "メッセージを入力"}
          className="
            flex-1 bg-transparent px-4 py-2 text-sm
            text-emerald-900 placeholder:text-emerald-400
            focus:outline-none disabled:opacity-50
          "
        />
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="
            p-2.5 rounded-xl
            bg-emerald-500 hover:bg-emerald-400
            disabled:bg-emerald-200
            text-white transition-all active:scale-95
          "
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