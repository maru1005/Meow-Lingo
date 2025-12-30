// frontend/src/app/chat/page.tsx
"use client";

import ChatMessageList from "@/components/chat/ChatMessageList";
import ChatInput from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/useChat";

export default function ChatPage() {
    const { messages, sendMessage } = useChat();

    return (
        <div className="mx-auto flex h-[calc(100vh-120px)] max-w-screen-sm flex-col px-4 py-4">
            <div className="flex flex-1 flex-col rounded-2xl border border-neutral-800 bg-neutral-950 p-4">
                <ChatMessageList messages={messages} />
                <ChatInput onSend={sendMessage} />
            </div>
        </div>
    );
}