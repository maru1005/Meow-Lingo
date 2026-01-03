// src/app/AuthProvider.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useChatStore } from "@/store/useChatStore";

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const {user, idToken, loading } = useAuth();

    
  
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Loading...
            </div>
        );
    }
    return <>{children}</>;
}