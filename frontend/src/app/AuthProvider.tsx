// src/app/AuthProvider.tsx
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { initAuth, loading } = useAuthStore();

    useEffect(() => {
        initAuth(); 
    }, [initAuth]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-emerald-600 font-bold">
                Loading Meow Lingo...
            </div>
        );
    }
    return <>{children}</>;
}