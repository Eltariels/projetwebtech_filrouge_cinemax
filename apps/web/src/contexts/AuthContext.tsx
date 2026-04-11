import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
    _id: string;
    username: string;
    email: string;
    avatar: string;
    profiles: { name: string; avatar: string; isKid: boolean }[];
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (!savedToken) { setIsLoading(false); return; }

        fetch("/api/users/me", { headers: { Authorization: `Bearer ${savedToken}` } })
            .then(r => { if (!r.ok) throw new Error(); return r.json(); })
            .then(data => setUser(data))
            .catch(() => { localStorage.removeItem("token"); setToken(null); })
            .finally(() => setIsLoading(false));
    }, []);

    const login = async (email: string, password: string) => {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const text = await res.text();
        let data: any;
        try { data = JSON.parse(text); } catch { throw new Error("Réponse invalide du serveur"); }
        if (!res.ok) throw new Error(data.error || "Erreur de connexion");
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
    };

    const register = async (username: string, email: string, password: string) => {
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });
        const text = await res.text();
        let data: any;
        try { data = JSON.parse(text); } catch { throw new Error("Réponse invalide du serveur — le backend est-il lancé ?"); }
        if (!res.ok) throw new Error(data.error || "Erreur d'inscription");
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setIsLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth doit être dans AuthProvider");
    return ctx;
};