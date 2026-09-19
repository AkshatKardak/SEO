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

    // Auto-sync Clerk user with backend to obtain a verified MongoDB JWT session
    useEffect(() => {
        let isMounted = true;
        if (isSignedIn && clerkUser) {
            const email = clerkUser.primaryEmailAddress?.emailAddress;
            if (email) {
                localStorage.setItem("user_email", email);
            }

            authAPI.syncClerk({
                clerkId: clerkUser.id,
                email,
                name: clerkUser.fullName || clerkUser.firstName || clerkUser.username || "Operator",
            }).then((res) => {
                if (isMounted && res?.token) {
                    localStorage.setItem("token", res.token);
                    setToken(res.token);
                    if (res.user) {
                        setLocalUser(res.user);
                        localStorage.setItem("user", JSON.stringify(res.user));
                    }
                }
            }).catch((err) => {
                console.warn("Clerk backend sync notice:", err.message);
            });
        } else if (isLoaded && !isSignedIn) {
            localStorage.removeItem("token");
            localStorage.removeItem("user_email");
            localStorage.removeItem("user");
            setToken(null);
            setLocalUser(null);
        }
        return () => { isMounted = false; };
    }, [isLoaded, isSignedIn, clerkUser]);

    const user: User | null = isSignedIn && clerkUser
        ? {
            _id: localUser?._id || clerkUser.id,
            name: clerkUser.fullName || clerkUser.firstName || clerkUser.username || "User",
            email: clerkUser.primaryEmailAddress?.emailAddress || "",
            plan: "Pro Growth",
            imageUrl: clerkUser.imageUrl,
        }
        : localUser;

    const effectiveToken = token || (isSignedIn ? "clerk-active-session" : null);

    const login = async (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        try {
            const data = await authAPI.getUser();
            const u = data.user ?? data;
            setLocalUser(u);
            if (u.email) {
                localStorage.setItem("user_email", u.email);
            }
        } catch {
            // fallback
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user");
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
                .then((data) => {
                    const u = data.user ?? data;
                    setUser(u);
                    if (u.email) {
                        localStorage.setItem("user_email", u.email);
                    }
                })
                .catch(() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user_email");
                    setToken(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        const data = await authAPI.getUser();
        const u = data.user ?? data;
        setUser(u);
        if (u.email) {
            localStorage.setItem("user_email", u.email);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user");
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

