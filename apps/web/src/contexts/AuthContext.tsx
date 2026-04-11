import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
    _id: string;
    username: string;
    email: string;
    avatar: string;
    role?: string;
    profiles: { name: string; avatar: string; isKid: boolean }[];
    preferences?: any;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    setUser: (u: User) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user,      setUser]      = useState<User | null>(null);
    const [token,     setToken]     = useState<string | null>(localStorage.getItem("token"));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (!savedToken) { setIsLoading(false); return; }

        // Refresh silencieux : renouvelle le JWT à chaque ouverture de l'app
        // Cela maintient la session active tant que l'utilisateur revient au moins tous les 7 jours
        fetch("/api/auth/refresh", {
            method: "POST",
            headers: { Authorization: `Bearer ${savedToken}` },
        })
        .then(r => r.ok ? r.json() : Promise.reject(r.status))
        .then(data => {
            // Refresh OK → stocke le nouveau token + user
            localStorage.setItem("token", data.token);
            setToken(data.token);
            setUser(data.user);
        })
        .catch(() => {
            // Refresh échoué → nettoie la session
            localStorage.removeItem("token");
            setToken(null);
        })
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
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, setUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth doit être dans AuthProvider");
    return ctx;
};
