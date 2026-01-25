// frontend/src/app/selection/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/useChatStore";
import Image from "next/image";

const modes = [
  { id: "study", label: "Free", sub: "自由会話", color: "bg-emerald-400" },
  { id: "vocabulary", label: "Vocabulary", sub: "単語学習", color: "bg-blue-400" },
  { id: "grammar", label: "Grammar", sub: "文法特訓", color: "bg-rose-400" },
  { id: "test", label: "Test", sub: "実力試し", color: "bg-orange-400" },
] as const;

export default function SelectionPage() {
  const router = useRouter();
  const { setMode, resetChat } = useChatStore();

  const handleSelect = (mode: typeof modes[number]["id"]) => {
    resetChat(); // 以前の会話をクリア
    setMode(mode);
    router.push("/chat");
  };

  return (
        <main className="w-full h-full bg-emerald-50 text-neutral-800">
            <div className="h-full flex flex-col items-center">

                {/* 上余白（可変） */}
                <div className="flex-[0.3]" />

                {/* キャラクター画像 - リーダーのこだわり drop-shadow */}
                <div className="relative w-full max-w-[420px] aspect-square drop-shadow-lg animate-jump-meow">
                    <Image
                        src="/images/jump-meow.png"
                        alt="Walking Apple Cat"
                        fill
                        className="object-contain"
                        priority
                        sizes="(max-width: 768px) 90vw, 420px"
                    />
                </div>

                {/* モード選択エリア */}
                <div className="w-full max-w-[420px] px-5">
                    <p className="text-center text-sm tracking-wider text-neutral-500 mb-4 font-bold">
                        今日は何するにゃ？
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        {modes.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => handleSelect(m.id)}
                                // ✅ リーダーが作った ぷっくりボタンデザイン復活ニャ！
                                className="group relative h-[78px] w-full flex flex-col items-center justify-center overflow-hidden rounded-[28px] transition-all active:scale-95 shadow-md"
                            >
                                {/* 背景カラー */}
                                <span className={`absolute inset-0 ${m.color}`} />
                                {/* 上部の光沢（ぷっくり感） */}
                                <span className="absolute left-3 right-3 top-2 h-7 rounded-full bg-white/30 blur-[0.5px]" />
                                {/* 下部の影（立体感） */}
                                <span
                                    className={`absolute inset-x-0 bottom-0 h-8 rounded-b-[28px] ${m.color}/60 blur-[1.5px] shadow-inner`}
                                />

                                <div className="relative z-10 flex flex-col items-center">
                                    <span className="text-[17px] font-black tracking-tight text-white drop-shadow-[0_1.5px_0_rgba(0,0,0,0.2)]">
                                        {m.label}
                                    </span>
                                    <span className="text-[10px] font-bold text-white/80 mt-0.5">
                                        {m.sub}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 戻る導線 */}
                <button
                    onClick={() => router.push("/")}
                    className="mt-4 text-xs text-emerald-700 underline underline-offset-4 font-bold opacity-70 hover:opacity-100 transition-opacity"
                >
                    ← トップに戻る
                </button>

                {/* 下余白（可変・やや多め） */}
                <div className="flex-[1]" />
            </div>
        </main>
    );
}