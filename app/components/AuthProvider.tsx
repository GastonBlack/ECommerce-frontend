"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api/axios";
import type { UserMe } from "@/lib/types/user";

type AuthContextType = {
    user: UserMe | null;
    loadingAuth: boolean;
    refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loadingAuth: true,
    refresh: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserMe | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    const refresh = async () => {
        try {
            const res = await api.get("/auth/verify");
            setUser(res.data);
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                await refresh();
            } finally {
                setLoadingAuth(false);
            }
        })();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loadingAuth, refresh }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
