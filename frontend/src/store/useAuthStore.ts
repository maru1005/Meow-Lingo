// src/store/useAuthStore.ts
"use client";

import { create } from "zustand";
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export type AuthState = {
    user: User | null;
    loading: boolean;
    initialized: boolean;
    initAuth: () => void;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    loading: true,
    initialized: false,

    // 🔁 Firebase 認証状態を1回だけ監視
    initAuth: () => {
        if (get().initialized) return;

        onAuthStateChanged(auth, (firebaseUser) => {
            set({
                user: firebaseUser,
                loading: false,
                initialized: true,
            });
        });
    },

    login: async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password);
    },

    signup: async (email, password) => {
        await createUserWithEmailAndPassword(auth, email, password);
    },

    logout: async () => {
        await signOut(auth);
        set({ user: null });
    },
}));

