// frontend/src/store/useChatStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // 
import { apiFetch } from '@/lib/api';
import { Message, ChatReplyResponse, MessageRole } from '@/types/chat';

interface ConversationSummary {
    conversation_id: string;
    title: string;
    updated_at: string;
}

interface ChatState {
    messages: Message[];
    history: ConversationSummary[];
    currentMode: 'study' | 'vocabulary' | 'grammar' | 'test';
    conversationId: string | null;
    isLoading: boolean;
    isSidebarOpen: boolean;
    
    setMode: (mode: ChatState['currentMode']) => void;
    toggleSidebar: () => void;
    initialGreeting: () => Promise<void>;
    sendMessage: (content: string) => Promise<void>;
    fetchHistory: () => Promise<void>;
    selectConversation: (id: string) => Promise<void>;
    resetChat: () => Promise<void>;
    deleteConversation: (id: string) => Promise<void>;
}

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            messages: [],
            history: [],
            currentMode: 'study',
            conversationId: null,
            isLoading: false,
            isSidebarOpen: false,

            setMode: (mode) => set({ currentMode: mode }),
            toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

            initialGreeting: async () => {
                set({ isLoading: true, messages: [] });
                try {
                    const data = await apiFetch<ChatReplyResponse>("/chat", "POST", {
                        message: "INITIAL_GREETING",
                        mode: get().currentMode,
                        conversation_id: null
                    });
                    set({ 
                        messages: [{ role: 'assistant', content: data.reply }],
                        conversationId: data.conversation_id,
                        isLoading: false 
                    });
                    await get().fetchHistory();
                } catch (error) {
                    console.error('挨拶できなかったにゃ、、、', error);
                    set({ isLoading: false });
                }
            },

            sendMessage: async (content: string) => {
                const { messages, currentMode, conversationId } = get();
                const userMsg: Message = { role: 'user', content };
                set({ messages: [...messages, { role: 'user', content }], isLoading: true });

                try {
                    const data = await apiFetch<ChatReplyResponse & {title?: string}>("/chat", "POST", {
                        message: content,
                        mode: currentMode,
                        conversation_id: conversationId
                    });

                    set((state) => {
                        const aiMsg: Message = { role: 'assistant', content: data.reply };
                        const nextMessages = [...state.messages, aiMsg];
                        const updatedHistory = state.history.map(item => {
                            if (item.conversation_id === data.conversation_id && data.title) {
                                return { ...item, title: data.title };
                            }
                            return item;
                        });

                        return {
                            ...state,
                            messages: nextMessages,
                            conversationId: data.conversation_id,
                            history: updatedHistory,
                            isLoading: false
                        };
                    });

                    if (!conversationId) {
                        await get().fetchHistory();
                    }

                } catch (error) {
                    console.error('送信失敗にゃ、、、', error);
                    set({ isLoading: false });
                }
            }, 


            fetchHistory: async () => {
                try {
                    const data = await apiFetch<any[]>("/chat/conversations", "GET");
                    const mappedHistory = data.map(item => ({
                        ...item,
                        conversation_id: item.conversation_id || item.conversation_uuid,
                        title: item.title,
                        updated_at: item.updated_at
                    }));
                    set({ history: mappedHistory });
                } catch (error) {
                    console.error("History fetch failed", error);
                }
            },

            selectConversation: async (id: string) => {
                set({ isLoading: true });
                try {
                    const data = await apiFetch<any>(`/chat/conversations/${id}`, "GET");
                    const cleanMessages = (data.messages || []).filter(
                        (m: any) => m.content !== "INITIAL_GREETING"
                    );
                    set({ 
                        messages: cleanMessages, 
                        conversationId: id, 
                        isLoading: false 
                    });
                } catch (error) {
                    console.error('履歴取得失敗にゃ、、、', error)
                    set({ isLoading: false });
                }
            },

            deleteConversation: async (id: string) => {
                try {
                    await apiFetch(`/chat/conversations/${id}`, "DELETE");
                    set((state) => ({
                        history: state.history.filter(item => item.conversation_id !== id)
                    }));
                    if (get().conversationId === id) {
                        set({ messages: [], conversationId: null });
                    }
                } catch (error) {
                    console.error('削除失敗にゃ、、、', error);
                }
            },

            resetChat: async () => {
                set({ messages: [], conversationId: null });
            }
        }),
        {
            name: 'chat-storage', // ローカルストレージのキー名
            partialize: (state) => ({ 
                conversationId: state.conversationId, 
                currentMode: state.currentMode 
            }), 
        }
    )
);