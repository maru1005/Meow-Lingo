"use client";

import { useEffect } from "react";
import { useChatStore, ChatState } from "@/store/useChatStore";
import { useAuthStore, AuthState } from "@/store/useAuthStore";

export const Sidebar = () => {
    // ストアから必要な状態と関数を取得
    const history = useChatStore((state: ChatState) => state.history);
    const isSidebarOpen = useChatStore((state: ChatState) => state.isSidebarOpen);
    const toggleSidebar = useChatStore((state: ChatState) => state.toggleSidebar);
    const selectConversation = useChatStore((state: ChatState) => state.selectConversation);
    const fetchHistory = useChatStore((state: ChatState) => state.fetchHistory);
    
    const idToken = useAuthStore((state: AuthState) => state.idToken);

    useEffect(() => {
        const loadData = async () => {
            if (idToken) {
                console.log("🛠️ [Sidebar] 履歴取得を開始するにゃ。Tokenあり");
                try {
                    await fetchHistory(idToken);
                    console.log("✅ [Sidebar] 履歴取得に成功したにゃ！");
                } catch (error) {
                    console.error("❌ [Sidebar] 履歴取得でエラーが発生したにゃ:", error);
                }
            } else {
                console.log("⚠️ [Sidebar] idTokenがまだないから取得を待機中だにゃ");
            }
        };

        // サイドバーが開いた時、またはトークンが確定した時にリロード
        if (isSidebarOpen) {
            loadData();
        }
    }, [isSidebarOpen, idToken, fetchHistory]);

    return (
        <>
            {/* 背景の影（オーバーレイ） */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-emerald-900/40 backdrop-blur-sm z-40 transition-opacity" 
                    onClick={toggleSidebar} 
                />
            )}

            {/* サイドバー本体 */}
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
                                        console.log(`選択された会話ID: ${chat.conversation_id}`);
                                        selectConversation(chat.conversation_id, idToken);
                                        toggleSidebar(); // 選択したら閉じる
                                    }}
                                    className="w-full text-left p-3 text-sm text-emerald-800 hover:bg-emerald-200/50 rounded-xl transition-all border border-transparent hover:border-emerald-200 group"
                                >
                                    <div className="font-medium truncate mb-1">
                                        {chat.title || "🐱 新しい会話"}
                                    </div>
                                    {chat.updated_at && (
                                        <div className="text-[10px] text-emerald-400 group-hover:text-emerald-600 transition-colors">
                                            {new Date(chat.updated_at).toLocaleString('ja-JP', {
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};