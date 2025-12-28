"use client";

import { useState } from "react";

/**
 * 入力欄（3行）
 */
export default function ChatInput({
    onSend,
}: {
    onSend: (text: string) => void;
}) {
    const [text, setText] = useState("");

    const handleSend = () => {
        onSend(text);
        setText("");
    };

    return (
        <div className="mt-3 border-t border-neutral-800 pt-3">
            <textarea
                rows={3} // ← ★ 3行
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="英語について質問してみよう"
                className="w-full resize-none rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="mt-2 flex justify-end">
                <button
                    onClick={handleSend}
                    className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-500"
                >
                    送信
                </button>
            </div>
        </div>
    );
}
