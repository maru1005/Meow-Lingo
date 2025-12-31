// src/components/features/chat/ChatMessageList.tsx
"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/types/chat";
import { User, Bot } from "lucide-react";
import { useChatStore } from "./store/useChatStore";

export default function ChatMessageList() {
  const { messages } = useChatStore();
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 custom-scrollbar">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex items-start gap-3 ${
            msg.role === "user" ? "flex-row-reverse" : "flex-row"
          } animate-in fade-in slide-in-from-bottom-2`}
        >
          {/* アイコン */}
          <div
            className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${
              msg.role === "user" ? "bg-emerald-500" : "bg-rose-400"
            }`}
          >
            {msg.role === "user" ? (
              <User className="w-5 h-5 text-white" />
            ) : (
              <Bot className="w-5 h-5 text-white" />
            )}
          </div>

          {/* メッセージ */}
          <div
            className={`relative flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            } max-w-[70%]`}
          >
            <span className="text-[10px] mb-1 font-bold tracking-tight text-emerald-500">
              {msg.role === "user" ? "You" : "Meow"}
            </span>

            <div
              className={`relative px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                msg.role === "user"
                  ? "bg-emerald-500 text-white rounded-2xl rounded-tr-none"
                  : "bg-white/90 text-emerald-900 rounded-2xl rounded-tl-none border border-emerald-200"
              }`}
            >
              {/* 吹き出しのしっぽ */}
              <div
                className={`absolute top-0 w-3 h-3 ${
                  msg.role === "user"
                    ? "-right-1 bg-emerald-500 [clip-path:polygon(0_0,0_100%,100%_0)]"
                    : "-left-1 bg-white [clip-path:polygon(0_0,100%_100%,100%_0)] border-l border-emerald-200"
                }`}
              />

              <div className="relative z-10 whitespace-pre-wrap">
                {msg.content}
              </div>
            </div>
          </div>
        </div>
      ))}
      <div ref={scrollEndRef} />
    </div>
  );
}