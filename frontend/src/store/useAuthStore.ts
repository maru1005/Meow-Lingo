"use client";

import { create } from "zustand";
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export type AuthState = {
    user: User | null;
    idToken: string | null;      
    loading: boolean;
    initialized: boolean;
    initAuth: () => void;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    idToken: null,
    loading: true,
    initialized: false,

    // 🔁 Firebase 認証状態を監視し、トークンを自動更新する
    initAuth: () => {
        if (get().initialized) return;

        onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const token = await firebaseUser.getIdToken();
                console.log("🔑 [AuthStore] トークンを取得・更新したニャ！");
                set({
                    user: firebaseUser,
                    idToken: token,
                    loading: false,
                    initialized: true,
                });
            } else {
                set({
                    user: null,
                    idToken: null,
                    loading: false,
                    initialized: true,
                });
            }
        });
    },

    login: async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password);
        // login成功時も onAuthStateChanged が走るので、ここでは set しなくてOK
    },

    signup: async (email, password) => {
        await createUserWithEmailAndPassword(auth, email, password);
    },

    logout: async () => {
        await signOut(auth);
        set({ user: null, idToken: null });
    },
}));