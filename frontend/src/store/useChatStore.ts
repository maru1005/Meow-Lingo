// frontend/src/store/useChatStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiFetch } from '@/lib/api';
import { Message, ChatReplyResponse, ConversationSummary, ChatState, ChatMode, MessageSummary } from '@/types/chat';

export const useChatStore = create<ChatState & {
    setMode: (mode: ChatMode) => void;
    toggleSidebar: () => void;
    initialGreeting: () => Promise<void>;
    sendMessage: (content: string) => Promise<void>;
    fetchHistory: () => Promise<void>;
    selectConversation: (id: string) => Promise<void>;
    resetChat: () => Promise<void>;
    deleteConversation: (id: string) => Promise<void>;
}>()(
    persist(
        (set, get) => ({
            messages: [],
            history: [],
            currentMode: 'study',
            conversationId: null,
            isLoading: false,
            isSidebarOpen: false,

            setMode: (mode: ChatMode) => set({ currentMode: mode }),
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
                        messages: [{ role: 'assistant', content: data.reply, id: `msg-${Date.now()}` }],
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
                const userMsg: Message = { role: 'user', content, id: `msg-${Date.now()}-user` };
                set({ messages: [...messages, userMsg], isLoading: true });

                try {
                    const data = await apiFetch<ChatReplyResponse & {title?: string}>("/chat", "POST", {
                        message: content,
                        mode: currentMode,
                        conversation_id: conversationId
                    });

                    set((state) => {
                        const aiMsg: Message = { role: 'assistant', content: data.reply, id: `msg-${Date.now()}-assistant` };
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
                    const data = await apiFetch<ConversationSummary[]>("/chat/conversations", "GET");
                    set({ history: data });
                } catch (error: any) {
                    // 401/403は認証エラー - ログイン画面へリダイレクト
                    if (error?.status === 401 || error?.status === 403) {
                        console.warn("認証エラー：ログインが必要です", error);
                        set({ history: [] });
                        return;
                    }
                    // その他のエラーはログのみ
                    console.error("History fetch failed", error);
                    set({ history: [] });
                }
            },

            selectConversation: async (id: string) => {
                set({ isLoading: true });
                try {
                    const data = await apiFetch<ConversationSummary>(`/chat/conversations/${id}`, "GET");
                    const cleanMessages = (data.messages || [])
                        .filter((m: MessageSummary) => m.content !== "INITIAL_GREETING")
                        .map((m: MessageSummary, idx: number) => ({
                            ...m,
                            id: `msg-${id}-${idx}`
                        } as Message));
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