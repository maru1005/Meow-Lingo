"use client";

import { useEffect, useRef } from "react";
import { useChatStore, ChatState } from "@/store/useChatStore";
import { useAuthStore, AuthState } from "@/store/useAuthStore";

export const Sidebar = () => {
    // 各ストアから必要なものを取得
    const { history, isSidebarOpen, toggleSidebar, selectConversation, fetchHistory } = useChatStore();
    const { idToken, initAuth } = useAuthStore();
    const isInitialized = useRef(false);

    // 💡 1. 認証の監視を開始（リロード対策）
    useEffect(() => {
        initAuth();
    }, [initAuth]);

    // 💡 2. トークンが手に入ったら履歴を復元
    useEffect(() => {
        // トークンがない、または既に実行済みなら何もしない
        if (!idToken || isInitialized.current) return;

        const loadData = async () => {
            console.log("🚀 [Sidebar] 復元プロセス開始にゃ！");
            
            // Zustand の最新の関数を直接奪い取る
            const chatState = useChatStore.getState();
            
            try {
                // 1. 履歴を同期
                await chatState.fetchHistory(idToken);
                
                // 2. ブラウザのメモをチェック
                const savedId = window.localStorage.getItem("last_conv_id");
                console.log("📝 [Sidebar] 保存されていたID:", savedId);

                if (savedId) {
                    console.log("🔄 [Sidebar] 続きをロードするにゃ:", savedId);
                    await chatState.selectConversation(savedId, idToken);
                } else {
                    console.log("🆕 [Sidebar] 新規チャットを開始するにゃ");
                    await chatState.resetChat(idToken);
                }
                
                // 完了フラグを立てる
                isInitialized.current = true;
            } catch (err) {
                console.error("❌ 復元に失敗したにゃ:", err);
            }
        };

        loadData();

        // 💡 依存配列から fetchHistory などの関数をあえて外す！
        // idToken が確定した瞬間だけ動けばいいから、これで安定する。
    }, [idToken]);
    return (
        <>
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-emerald-900/40 backdrop-blur-sm z-40 transition-opacity" onClick={toggleSidebar} />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-emerald-50 shadow-2xl border-r border-emerald-200 transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="p-4 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6 border-b border-emerald-100 pb-4">
                        <h2 className="text-emerald-900 font-bold flex items-center gap-2">
                            <span>🐱</span> 会話履歴
                        </h2>
                        <button onClick={toggleSidebar} className="p-2 hover:bg-emerald-100 rounded-full text-emerald-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

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
                                        selectConversation(chat.conversation_id, idToken!);
                                        toggleSidebar();
                                    }}
                                    className="w-full text-left p-3 text-sm text-emerald-800 hover:bg-emerald-200/50 rounded-xl transition-all border border-transparent hover:border-emerald-200 group"
                                >
                                    <div className="font-medium truncate mb-1">{chat.title || "🐱 新しい会話"}</div>
                                    {chat.updated_at && (
                                        <div className="text-[10px] text-emerald-400 group-hover:text-emerald-600">
                                            {new Date(chat.updated_at).toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
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