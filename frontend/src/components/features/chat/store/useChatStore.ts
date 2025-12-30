// src/components/features/chat/store/useChatStore.ts
import { create } from 'zustand';
import { chatApi } from '@/components/features/chat/api/chatApi';
import { Message, ChatReplyResponse } from '@/types/chat';

interface ChatState {
    messages: Message[];
    isLoading: boolean;
    conversationId: string | null;
    sendMessage: (content: string, idToken?: string | null) => Promise<void>;
    resetChat: (idToken?: string | null) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
    messages: [],
    isLoading: false,
    conversationId: null,

    sendMessage: async (content: string, idToken?: string | null) => {
        const userMsg: Message = { role: 'user', content };
        set((state) => ({ 
            messages: [...state.messages, userMsg],
            isLoading: true 
        }));

        try {
            const data = await chatApi.sendMessage(content, idToken);
            const aiMsg: Message = { role: 'assistant', content: data.reply };
            set((state) => ({ 
                messages: [...state.messages, aiMsg],
                conversationId: data.conversation_id,
                isLoading: false 
            }));
        } catch (error) {
            console.error(error);
            set({ isLoading: false });
        }
    },

    resetChat: async (idToken?: string | null) => {
        try {
            const data = await chatApi.reset(idToken);
            set({ messages: [], conversationId: data.conversation_id });
        } catch (error) {
            console.error(error);
        }
    }
}));