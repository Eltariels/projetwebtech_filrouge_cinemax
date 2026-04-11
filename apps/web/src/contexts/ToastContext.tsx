import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ToastType = "success" | "error" | "info";
interface Toast { id: number; message: string; type: ToastType; }

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback((message: string, type: ToastType = "success") => {
        const id = Date.now();
        setToasts(t => [...t, { id, message, type }]);
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
    }, []);

    const colors: Record<ToastType, string> = {
        success: "linear-gradient(135deg, #1a3a1a, #2d5a2d)",
        error:   "linear-gradient(135deg, #3a1a1a, #5a2d2d)",
        info:    "linear-gradient(135deg, var(--gold-dark), #5a4010)",
    };
    const borders: Record<ToastType, string> = {
        success: "#4caf50", error: "#e74c3c", info: "var(--gold)",
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div style={{ position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 9999, display: "flex", flexDirection: "column", gap: "0.6rem", maxWidth: 340 }}>
                {toasts.map(t => (
                    <div key={t.id} style={{
                        background: colors[t.type],
                        border: `1px solid ${borders[t.type]}`,
                        borderRadius: 6, padding: "0.85rem 1.1rem",
                        color: "#f0ede8", fontSize: "0.875rem",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                        animation: "slideIn 0.25s ease",
                        display: "flex", alignItems: "center", gap: "0.6rem",
                    }}>
                        <span>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
                        {t.message}
                    </div>
                ))}
            </div>
            <style>{`@keyframes slideIn { from { opacity:0; transform: translateX(20px); } to { opacity:1; transform: translateX(0); } }`}</style>
        </ToastContext.Provider>
    );
}

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast doit être dans ToastProvider");
    return ctx;
};
