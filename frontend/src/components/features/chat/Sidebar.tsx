"use client";

import { useEffect, useRef } from "react";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";

export const Sidebar = () => {
    // 各ストアから必要なものを取得
    const { history, isSidebarOpen, toggleSidebar, selectConversation } = useChatStore();
    const { idToken, initAuth } = useAuthStore();
    const isInitialized = useRef(false);

    // 💡 判定ロジック：タイトルが日付形式（数字・記号のみ）かどうかを判定する関数
    const isValidTitle = (title: string | null | undefined) => {
        if (!title || title.trim() === "") return false;
        // 数字、ハイフン、スラッシュ、コロン、スペースのみの構成なら「日付タイトル」とみなす
        const datePattern = /^[\d\s\-:\/]+$/;
        return !datePattern.test(title);
    };

    // 💡 1. 認証の監視を開始（リロード対策）
    useEffect(() => {
        initAuth();
    }, [initAuth]);

    // 💡 2. トークンが手に入ったら履歴を復元
    useEffect(() => {
        if (!idToken || isInitialized.current) return;

        const loadData = async () => {
            console.log("🚀 [Sidebar] 復元プロセス開始にゃ！");
            const chatState = useChatStore.getState();
            
            try {
                await chatState.fetchHistory(idToken);
                const savedId = window.localStorage.getItem("last_conv_id");

                if (savedId) {
                    await chatState.selectConversation(savedId, idToken);
                } else {
                    await chatState.resetChat(idToken);
                }
                isInitialized.current = true;
            } catch (err) {
                console.error("❌ 復元に失敗したにゃ:", err);
            }
        };

        loadData();
    }, [idToken]);

    return (
        <>
            {/* 背景のオーバーレイ */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-emerald-900/40 backdrop-blur-sm z-40 transition-opacity" onClick={toggleSidebar} />
            )}

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
                        <button onClick={toggleSidebar} className="p-2 hover:bg-emerald-100 rounded-full text-emerald-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* ✨ 3. 新規作成ボタン */}
                    <button 
                        onClick={() => {
                            useChatStore.getState().resetChat(idToken!);
                            toggleSidebar();
                        }}
                        className="mb-6 w-full rounded-xl bg-emerald-500 py-3 text-white font-bold shadow-md hover:bg-emerald-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    > 
                        <span className="text-xl">+</span> 新しい学習を始める
                    </button>

                    {/* 履歴リスト部分 */}
                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {/* 💡 4. 有効なタイトルがある会話だけをカウントして表示判断 */}
                        {history.filter(chat => isValidTitle(chat.title)).length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-emerald-400 text-xs">まだ履歴がないにゃ</p>
                            </div>
                        ) : (
                            history
                                .filter(chat => isValidTitle(chat.title)) // 💡 ここで日付タイトルを除外！
                                .map((chat) => (
                                    <button
                                        key={chat.conversation_id}
                                        onClick={() => {
                                            selectConversation(chat.conversation_id, idToken!);
                                            toggleSidebar();
                                        }}
                                        className="w-full text-left p-4 text-sm text-emerald-800 bg-white/50 hover:bg-emerald-200/50 rounded-2xl transition-all border border-emerald-100 shadow-sm hover:shadow group"
                                    >
                                        <div className="font-bold truncate mb-1 group-hover:text-emerald-900">{chat.title}</div>
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