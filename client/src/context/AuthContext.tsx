/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { authAPI } from "../services/api";

export interface User {
    _id: string;
    name: string;
    email: string;
    plan: string;
    imageUrl?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
    isClerk: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const hasClerk = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

function ClerkAuthBridge({ children }: { children: React.ReactNode }) {
    const { isLoaded, isSignedIn, user: clerkUser } = useUser();
    const { signOut } = useClerk();
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
    const [localUser, setLocalUser] = useState<User | null>(null);

    const user: User | null = isSignedIn && clerkUser
        ? {
            _id: clerkUser.id,
            name: clerkUser.fullName || clerkUser.firstName || clerkUser.username || "User",
            email: clerkUser.primaryEmailAddress?.emailAddress || "",
            plan: "Pro Growth",
            imageUrl: clerkUser.imageUrl,
        }
        : localUser;

    const effectiveToken = isSignedIn ? (token || "clerk-active-session") : token;

    const login = async (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        try {
            const data = await authAPI.getUser();
            setLocalUser(data.user ?? data);
        } catch {
            // fallback
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setLocalUser(null);
        if (isSignedIn) {
            signOut();
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token: effectiveToken,
                loading: !isLoaded,
                login,
                logout,
                isClerk: true,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

function StandardAuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            authAPI.getUser()
                .then((data) => setUser(data.user ?? data))
                .catch(() => { localStorage.removeItem("token"); setToken(null); })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        const data = await authAPI.getUser();
        setUser(data.user ?? data);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, isClerk: false }}>
            {children}
        </AuthContext.Provider>
    );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    if (hasClerk) {
        return <ClerkAuthBridge>{children}</ClerkAuthBridge>;
    }
    return <StandardAuthProvider>{children}</StandardAuthProvider>;
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};

