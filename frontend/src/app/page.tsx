// frontend/src/app/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-emerald-50 text-neutral-800">
            {/* 420px幅の“スマホ枠” */}
            <div className="mx-auto min-h-screen max-w-[420px] px-5 pt-8 pb-10">
                {/* 上部キャッチ */}
                <p className="text-center text-sm text-neutral-500">
                    1日1分から学ぶ英語
                </p>

                {/* ロゴ */}
                <div className="mt-4 flex justify-center">
                    <Image
                        src="/images/logo-yoko.png"
                        alt="Meow Lingo"
                        width={320}
                        height={90}
                        priority
                    />
                </div>

                {/* メインビジュアル（カプセル＋吹き出し） */}
                <div className="relative mx-auto mt-6 w-full max-w-[340px]">
                    <Image
                        src="/images/capsule.png"
                        alt="Meow Lingo capsule cat"
                        width={340}
                        height={340}
                        priority
                    />

                    {/* 吹き出し（右上に重ねる） */}
                    <div className="absolute -right-1 -top-3 w-[170px]">
                        <Image
                            src="/images/speech.png"
                            alt="Let's start learning!"
                            width={170}
                            height={110}
                            priority
                        />
                    </div>
                </div>

                {/* 説明 */}
                <p className="mt-10 text-center text-sm tracking-wider text-neutral-500">
                    カプセルを開けよう
                </p>

                {/* OPENボタン */}
                <div className="mt-4 flex justify-center">
                    <Link
                        href="/login"
                        aria-label="Go to login"
                        className="group relative inline-flex h-[56px] w-[280px] items-center justify-center overflow-hidden rounded-full"
                    >

                        {/* ふっくらベース */}
                        <span className="absolute inset-0 rounded-full bg-rose-400 shadow-md transition-all group-active:scale-[0.98]" />

                        {/* 上側ハイライト（ツヤ） */}
                        <span className="absolute left-3 right-3 top-2 h-6 rounded-full bg-white/30 blur-[0.5px]" />

                        {/* 下側の影（ふくらみ） */}
                        <span className="absolute inset-x-0 bottom-0 h-6 rounded-b-full bg-rose-400/70 blur-[2px]" />

                        {/* OPEN文字：白＋文字間＋黒フチっぽい影 */}
                        <span
                            className="relative z-10 text-[22px] font-extrabold tracking-[0.45em] text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.25)]"
                            style={{ paddingLeft: "0.45em" }} // trackingで右にズレる分の調整（見た目を中央に）
                        >
                            OPEN
                        </span>
                    </Link>
                </div>
            </div>
        </main>
    );
}
