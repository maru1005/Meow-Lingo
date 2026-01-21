"use client";

import { useEffect, useRef } from "react";
import { Volume2 } from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import Image from "next/image";

const MODE_ICONS = {
  study: "/images/green-icon.png",
  vocabulary: "/images/blue-icon.png",
  grammar: "/images/pink-icon.png",
  test: "/images/orange-icon.png",
};

export default function ChatMessageList() {
  const { messages,currentMode } = useChatStore();
  const scrollEndRef = useRef<HTMLDivElement>(null);

  const userIcon = MODE_ICONS[currentMode] || MODE_ICONS.study;

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    window.speechSynthesis.speak(utter);
  };

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 custom-scrollbar bg-slate-50/50">
      {messages.map((msg, i) => {
        const messageSections =msg.role ===  "assistant"
        ? msg.content.split(/---|\n\n+/).filter(section => section.trim().length > 0)
        :[msg.content];
        return (
        <div key={i} className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-2`}>
          {/* アイコン */}
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 relative bg-white">
            <Image 
              src={msg.role === "user" ? userIcon : "/images/footprints.png"} 
              alt="icon" 
              fill
              className="object-contain p-1"
              sizes="40px"
              style={{ width: "auto", height: "auto" }}
            />
          </div>
          {/* 吹き出し */}
          <div className={`flex flex-col max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"} space-y-2`}>
            {messageSections.map((section, j) => (
            <div key={j}
            className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
              msg.role === "user" ? "bg-emerald-500 text-white rounded-tr-none" : "bg-white text-emerald-900 border border-emerald-100 rounded-tl-none"
            }`}
            style={{ animationDelay: `${i * 0.15}s` }}
            >
              {section.trim()}
            </div>
            ))}
            {msg.role === "assistant" && (
              <button onClick={() => speak(msg.content)} className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-400">
                <Volume2 size={14} /> SPEAK
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