// src/app/chat/page.tsx
import ChatHeader from "@/components/features/chat/ChatHeader";
import ChatMessageList from "@/components/features/chat/ChatMessageList";
import ChatInput from "@/components/features/chat/ChatInput";

export default function ChatPage() {
  return (
    <div className="flex flex-col h-full bg-neutral-950">
      <ChatHeader />
      <ChatMessageList />
      <ChatInput />
    </div>
  );
}