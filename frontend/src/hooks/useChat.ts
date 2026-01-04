// frontend/src/hooks/useChat.ts
"use client";

import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";

export function useChat() {
    // 🏠 Store（Zustand）から必要なデータと関数を借りてくる
    const messages = useChatStore((state) => state.messages);
    const sendMessageStore = useChatStore((state) => state.sendMessage);
    const isLoading = useChatStore((state) => state.isLoading);
    
    // 🔑 認証トークン（AuthStore）を借りてくる
    const idToken = useAuthStore((state) => state.idToken);

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;
        
        // 🚀 自分で fetch せずに、Store の sendMessage を呼ぶ！
        // これが DB保存・AI返信取得・履歴の再読み込みを全部やってくれるニャ。
        await sendMessageStore(text, idToken);
    };

    return {
        messages,    
        sendMessage, 
        isLoading,   
    };
}