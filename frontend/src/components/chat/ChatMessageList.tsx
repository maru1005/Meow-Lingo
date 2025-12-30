// frontend/src/components/chat/ChatMessageList.tsx
"use client";

import { Message } from "@/hooks/useChat";

/**
 * メッセージ一覧
 */
export default function ChatMessageList({
    messages,
}: {
    messages: Message[];
}) {
    return (
        <div className="flex flex-col gap-3 overflow-y-auto px-1 py-2">
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${msg.role === "user"
                            ? "self-end bg-blue-600 text-white"
                            : "self-start bg-neutral-800 text-neutral-100"
                        }`}
                >
                    {msg.content}
                </div>
            ))}
        </div>
    );
}
