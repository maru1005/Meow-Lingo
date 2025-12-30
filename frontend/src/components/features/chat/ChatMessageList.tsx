// src/components/features/chat/ChatMessageList.tsx
"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/types/chat"; // 修正したtypesから取得
import { User, Bot } from "lucide-react";
import { useChatStore } from "./store/useChatStore";

export default function ChatMessageList() {
  const { messages } = useChatStore(); // Storeから取得
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 custom-scrollbar">
      {messages.map((msg, index) => (
        <div
          key={index} // APIからidが来ない場合は暫定的にindex、来たらmsg.id
          className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-2`}
        >
          <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-lg ${
            msg.role === "user" ? "bg-blue-600" : "bg-emerald-600"
          }`}>
            {msg.role === "user" ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
          </div>

          <div className={`relative flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} max-w-[70%]`}>
            <span className="text-[10px] text-neutral-500 mb-1 font-bold tracking-tighter uppercase">
              {msg.role === "user" ? "You" : "English Coach"}
            </span>
            
            <div
              className={`relative px-4 py-2.5 text-sm leading-relaxed shadow-lg ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-2xl rounded-tr-none"
                  : "bg-neutral-800 text-neutral-100 rounded-2xl rounded-tl-none border border-neutral-700"
              }`}
            >
              <div className={`absolute top-0 w-3 h-3 ${
                msg.role === "user" 
                  ? "-right-1 bg-blue-600 [clip-path:polygon(0_0,0_100%,100%_0)]"
                  : "-left-1 bg-neutral-800 [clip-path:polygon(0_0,100%_100%,100%_0)] border-l border-neutral-700"
              }`} />
              
              <div className="relative z-10 whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        </div>
      ))}
      <div ref={scrollEndRef} />
    </div>
  );
}