// src/app/chat/page.tsx
import ChatHeader from "@/components/features/chat/ChatHeader";
import ChatMessageList from "@/components/features/chat/ChatMessageList";
import ChatInput from "@/components/features/chat/ChatInput";

export default function ChatPage() {
  return (
    <div
      className="
        flex flex-col flex-1
        bg-white/80
        backdrop-blur
        rounded-2xl
        shadow-sm
      "
    >
      <ChatHeader />
      <ChatMessageList />
      <ChatInput />
    </div>
  );
}