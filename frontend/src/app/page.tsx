import Link from "next/link";

export default function HomePage() {
    return (
        <main className="mx-auto min-h-screen max-w-[420px] bg-white">
            <div className="px-5 pt-10">
                <h1 className="text-3xl font-bold">English Learning AI</h1>
                <p className="mt-2 text-gray-600">あなたの英語学習パートナー</p>

                <div className="mt-10 rounded-2xl border bg-gray-50 p-5">
                    <p className="text-lg font-semibold">まずはチャットを開こう</p>
                    <p className="mt-2 text-sm text-gray-600">
                        日常会話・単語・文法など、気軽に聞けるよ。
                    </p>

                    <Link
                        href="/chat"
                        className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white"
                    >
                        チャットへ
                    </Link>
                </div>
            </div>

            <div className="h-24" />
        </main>
    );
}
