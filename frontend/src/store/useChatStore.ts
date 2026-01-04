// src/components/features/chat/store/useChatStore.ts
import { create } from 'zustand';
import { chatApi } from '@/components/features/chat/api/chatApi';
import { Message, ChatReplyResponse } from '@/types/chat';

interface ConversationSummary {
    conversation_id: string;
    title: string;
    updated_at: string;
}

export interface ChatState {
    messages: Message[];
    history: ConversationSummary[];
    isLoading: boolean;
    isSidebarOpen: boolean;
    conversationId: string | null;
    toggleSidebar: () => void;
    setMessages: (messages: Message[]) => void;
    sendMessage: (content: string, idToken?: string | null) => Promise<void>;
    fetchHistory: (idToken?: string | null) => Promise<void>;
    selectConversation: (conversationId: string, idToken?: string | null) => Promise<void>;
    resetChat: (idToken?: string | null) => Promise<void>;
}

export const useChatStore = create<ChatState>()((set, get) => ({
    messages: [],
    history: [],
    isLoading: false,
    isSidebarOpen: true,
    conversationId: null,

    // UI操作
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setMessages: (messages) => set({ messages }),

    // API連動：送信
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
            // 送信後、履歴のタイトルが変わる可能性があるので履歴も更新
            get().fetchHistory(idToken); 
        } catch (error) {
            console.error(error);
            set({ isLoading: false });
        }
    },

    // API連動：履歴リスト取得
    fetchHistory: async (idToken?: string | null) => {
        try {
            // chatApiに履歴取得用メソッドを後で追加する
            const data = await chatApi.getConversations(idToken);
            set({ history: data });
        } catch (error) {
            console.error("履歴の取得に失敗したニャ:", error);
        }
    },

    // API連動：過去の会話を読み込む
    selectConversation: async (id: string, idToken?: string | null) => {
        set({ isLoading: true });
        try {
            const data = await chatApi.getConversationDetail(id, idToken);
            set({ 
                messages: data.messages, 
                conversationId: id,
                isLoading: false 
            });
        } catch (error) {
            console.error("会話の読み込みに失敗したニャ:", error);
            set({ isLoading: false });
        }
    },

    // API連動：リセット
    resetChat: async (idToken?: string | null) => {
        try {
            const data = await chatApi.reset(idToken);
            set({ 
                messages: [], 
                conversationId: data.conversation_id,
                isLoading: false 
            });
        } catch (error) {
            console.error(error);
        }
    }
}));