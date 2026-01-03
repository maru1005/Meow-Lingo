// src/components/features/chat/Sidebar.tsx
"use client";

import { useChatStore, ChatState } from "@/store/useChatStore";
import { useAuthStore, AuthState } from "@/store/useAuthStore";


// src/components/features/chat/Sidebar.tsx
export const Sidebar = () => {
    // 💡 型をしっかり指定して any を防ぐ
    const history = useChatStore((state: ChatState) => state.history);
    const isSidebarOpen = useChatStore((state: ChatState) => state.isSidebarOpen);
    const toggleSidebar = useChatStore((state: ChatState) => state.toggleSidebar);
    const selectConversation = useChatStore((state: ChatState) => state.selectConversation);
    const idToken = useAuthStore((state: AuthState) => state.idToken);

    return (
        <>
            {/* 背景の影（オーバーレイ）：ここがあるからメイン画面との境界がハッキリするニャ */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-emerald-900/40 backdrop-blur-sm z-40 transition-opacity" 
                    onClick={toggleSidebar} 
                />
            )}

            {/* サイドバー本体：エメラルド調の配色 */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-emerald-50 shadow-2xl border-r border-emerald-200 transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="p-4 flex flex-col h-full">
                    {/* ヘッダー部分 */}
                    <div className="flex justify-between items-center mb-6 border-b border-emerald-100 pb-4">
                        <h2 className="text-emerald-900 font-bold flex items-center gap-2">
                            <span>🐱</span> 会話履歴
                        </h2>
                        <button 
                            onClick={toggleSidebar} 
                            className="p-2 hover:bg-emerald-100 rounded-full text-emerald-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* 履歴リスト */}
                    <div className="flex-1 overflow-y-auto space-y-1">
                        {history.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-emerald-400 text-xs">まだ履歴がないにゃ</p>
                            </div>
                        ) : (
                            history.map((chat) => (
                                <button
                                    key={chat.conversation_id}
                                    onClick={() => {
                                        selectConversation(chat.conversation_id, idToken);
                                        toggleSidebar(); // 選択したら閉じる
                                    }}
                                    className="w-full text-left p-3 text-sm text-emerald-800 hover:bg-emerald-200/50 rounded-xl transition-all border border-transparent hover:border-emerald-200 truncate"
                                >
                                    {chat.title || "新しいおしゃべり"}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};