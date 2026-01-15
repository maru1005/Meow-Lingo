// frontend/src/components/layout/Sidebar.tsx 
"use client";

import { useChatStore } from "@/store/useChatStore";
import { useEffect } from "react";
import { Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function Sidebar() {
  const router = useRouter();
  const { isSidebarOpen, toggleSidebar, history, fetchHistory, selectConversation, resetChat, deleteConversation } = useChatStore();
  
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <>
      {isSidebarOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={toggleSidebar} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-emerald-100 transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 flex flex-col h-full">
          <button onClick={() => { resetChat(); toggleSidebar();
            router.push("/chat");
           }} className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-100 flex items-center justify-center gap-2">
          <Plus size={20} />
          New Learning
          </button>
          
          <div className="mt-8 flex-1 overflow-y-auto space-y-2">
            <p className="text-xs font-bold text-emerald-300 ml-2">HISTORY</p>
            
            {history.map((item) => (
              <div key={item.conversation_id} className="group relative">
                <button 
                  onClick={async () => { await selectConversation(item.conversation_id); toggleSidebar();
                    router.push("/chat");
                   }} 
                  className="w-full text-left p-3 text-sm hover:bg-emerald-50 rounded-xl border border-transparent hover:border-emerald-100 transition-all pr-12"
                >
                  <div className="font-bold text-emerald-800 truncate">{item.title}</div>
                  <div className="text-[10px] text-emerald-400">
                    {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : ""}
                  </div>
                </button>
                
                {/* 削除ボタン */}
                <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("この履歴を削除するにゃ？")) {
                    deleteConversation(item.conversation_id);
                  }
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-emerald-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={16} /> 
              </button>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}