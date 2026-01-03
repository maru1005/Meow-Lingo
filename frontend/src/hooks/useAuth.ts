// src/hooks/useAuth.ts
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * useAuth
 *
 * Firebase 認証状態を UI から扱いやすくするためのカスタム Hook。
 *
 * - 認証の実体（state / ロジック）は useAuthStore（Zustand）に集約
 * - この Hook は「UI との橋渡し」役
 *
 * 直接 Firebase を触らず、この Hook を通して利用する。
 */
export function useAuth() {
    const {
        user,       // 現在ログイン中のユーザー（未ログイン時は null）
        loading,    // 認証状態の初期化中フラグ
        initAuth,   // Firebase の onAuthStateChanged を開始する関数
        login,      // ログイン（Email / Password）
        signup,     // 新規登録（Email / Password）
        logout,     // ログアウト
    } = useAuthStore();

    /**
     * 🔁 認証状態の初期化
     *
     * - アプリ起動時に 1 度だけ実行される
     * - Firebase の onAuthStateChanged を登録し、
     *   ログイン状態の変更をグローバルに監視する
     *
     * ※ initAuth 内で多重登録を防止しているため、
     *   useEffect で安全に呼び出せる
     */
    useEffect(() => {
        initAuth();
    }, [initAuth]);

    /**
     * UI で使う値・関数のみを返す
     *
     * - user / loading : 表示制御用
     * - login / signup / logout : イベントハンドラ用
     */
    return {
        user,
        loading,
        login,
        signup,
        logout,
    };
}
