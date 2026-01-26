"use client";

import { create } from "zustand";
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AuthState } from "@/types/auth";


export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    idToken: null,
    loading: true,
    initialized: false,

    initAuth: () => {
        // すでに監視中なら何もしない
        if (get().initialized) return;
        set({ initialized: true });

        onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const token = await firebaseUser.getIdToken();
                set({
                    user: firebaseUser,
                    idToken: token,
                    loading: false,
                });
            } else {
                set({
                    user: null,
                    idToken: null,
                    loading: false,
                });
            }
        });
    },

    login: async (email, password) => {
        // 1. まずログイン実行
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // 2. その場で最新のトークンを取得してストアに入れる（監視を待たずに即座に反映！）
        const token = await userCredential.user.getIdToken();
        set({ 
            user: userCredential.user, 
            idToken: token,
            loading: false 
        });
    },

    signup: async (email, password) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        set({ user: userCredential.user, idToken: token, loading: false });
    },

    logout: async () => {
        await signOut(auth);
        set({ user: null, idToken: null });
    },
}));