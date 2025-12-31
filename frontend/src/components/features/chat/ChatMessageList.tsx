// src/components/features/chat/ChatMessageList.tsx
"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/types/chat";
import { User, Bot, Volume2 } from "lucide-react"; 
import { useChatStore } from "@/store/useChatStore";

export default function ChatMessageList() {
  const { messages } = useChatStore();
  const scrollEndRef = useRef<HTMLDivElement>(null);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US"; 
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  };

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 custom-scrollbar bg-slate-50">
      {messages.map((msg, index) => {
        const isUser = msg.role === "user";
        
        return (
          <div
            key={msg.id || index}
            className={`flex items-start gap-3 ${
              isUser ? "flex-row-reverse" : "flex-row"
            } animate-in fade-in slide-in-from-bottom-2`}
          >
            {/* アイコン */}
            <div
              className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${
                isUser ? "bg-emerald-500" : "bg-rose-400"
              }`}
            >
              {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
            </div>

            {/* メッセージコンテンツ全体 */}
            <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[75%]`}>
              <span className="text-[10px] mb-1 font-bold tracking-tight text-emerald-600/70">
                {isUser ? "YOU" : "MEOW LINGO"}
              </span>

              {/* 吹き出し本体 */}
              <div
                className={`relative px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? "bg-emerald-500 text-white rounded-2xl rounded-tr-none"
                    : "bg-white text-emerald-900 rounded-2xl rounded-tl-none border border-emerald-100"
                }`}
              >
                {/* しっぽ */}
                <div
                  className={`absolute top-0 w-3 h-3 ${
                    isUser
                      ? "-right-1 bg-emerald-500 [clip-path:polygon(0_0,0_100%,100%_0)]"
                      : "-left-1 bg-white [clip-path:polygon(0_0,100%_100%,100%_0)] border-l border-emerald-100"
                  }`}
                />

                <div className="relative z-10 whitespace-pre-wrap font-medium">
                  {msg.content}
                </div>
              </div>

              {/* 🔊 読み上げボタン（吹き出しの「外・下」に配置） */}
              {!isUser && (
                <button
                  onClick={() => speak(msg.content)}
                  className="flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full bg-white border border-emerald-100 text-emerald-600 shadow-sm active:bg-emerald-50 hover:bg-emerald-50 transition-all"
                >
                  <Volume2 size={14} />
                  <span className="text-[10px] font-extrabold tracking-wider"> </span>
                </button>
              )}
            </div>
          </div>
        );
      })}
      <div ref={scrollEndRef} />
    </div>
  );
}