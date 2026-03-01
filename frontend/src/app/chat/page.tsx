// src/app/chat/page.tsx
'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';
import ChatMessageList from '@/components/chat/ChatMessageList';
import ChatInput from '@/components/chat/ChatInput';
import Image from 'next/image';

const MODE_SETTINGS = {
  study: { label: 'FREE TALK MODE', color: 'text-emerald-600/80' },
  vocabulary: { label: 'VOCABULARY TRAINING', color: 'text-blue-600/80' },
  grammar: { label: 'GRAMMAR PRACTICE', color: 'text-rose-600/80' },
  test: { label: 'SKILL LEVEL TEST', color: 'text-orange-600/80' },
};

export default function ChatPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    initialGreeting,
    messages,
    currentMode,
    fetchHistory,
    conversationId,
    selectConversation,
    isLoading,
  } = useChatStore();

  const settings = MODE_SETTINGS[currentMode] || MODE_SETTINGS.study;

  const inputBarRef = useRef<HTMLDivElement>(null);
  const [inputBarHeight, setInputBarHeight] = useState(96);

  useLayoutEffect(() => {
    const el = inputBarRef.current;
    if (!el) return;

    const update = () => {
      const h = Math.ceil(el.getBoundingClientRect().height);
      setInputBarHeight(Math.max(96, h));
    };

    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  // 認証チェック + 履歴取得（ここが唯一の fetchHistory 呼び出し元）
  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }
    fetchHistory();
  }, [user, router, fetchHistory]);

  // リロード復元 or 新規挨拶
  useEffect(() => {
    if (!user || messages.length > 0 || isLoading) return;

    if (conversationId) {
      selectConversation(conversationId);
    } else {
      initialGreeting();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, conversationId]);

  if (!user) return null;

  return (
    <div className="mx-auto h-[calc(100vh-140px)] w-full max-w-none sm:max-w-[420px] px-4 py-3">
      <div className="grid h-full grid-rows-[auto,1fr] overflow-hidden rounded-3xl bg-white/90 shadow-xl border border-emerald-100 backdrop-blur-sm">
        <div className="shrink-0 px-6 pt-4 pb-2">
          <div
            className={`inline-flex items-center gap-2 text-[12px] font-bold ${settings.color} tracking-widest transition-colors duration-300`}
          >
            <Image src="/images/footprints.png" alt="" width={14} height={14} />
            <span>{settings.label}</span>
          </div>
        </div>

        <div className="min-h-0 flex flex-col">
          <ChatMessageList bottomPaddingPx={inputBarHeight + 24} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30">
        <div className="mx-auto w-full max-w-none sm:max-w-[420px] px-4">
          <div
            ref={inputBarRef}
            className="bg-white/70 backdrop-blur border border-emerald-100 border-t-emerald-50 rounded-t-3xl pb-[env(safe-area-inset-bottom)]"
          >
            <ChatInput />
          </div>
        </div>
      </div>
    </div>
  );
}
