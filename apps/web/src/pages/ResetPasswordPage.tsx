import { useState, FormEvent } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate       = useNavigate();
    const token          = searchParams.get("token") || "";

    const [password,  setPassword]  = useState("");
    const [password2, setPassword2] = useState("");
    const [error,     setError]     = useState("");
    const [loading,   setLoading]   = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        if (password !== password2) { setError("Les mots de passe ne correspondent pas."); return; }
        if (password.length < 6)    { setError("Minimum 6 caractères."); return; }
        if (!/\d/.test(password))   { setError("Le mot de passe doit contenir au moins un chiffre."); return; }

        setLoading(true);
        try {
            await api.resetPassword(token, password);
            // Redirige vers login après 2s
            setTimeout(() => navigate("/login"), 2000);
            setError(""); // clear
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div style={s.page}>
                <div style={s.bg} />
                <div className="auth-card" style={s.card}>
                    <h1 style={s.logo}>CINEMAX</h1>
                    <div style={s.errorBox}>Lien invalide ou expiré. <Link to="/forgot-password" style={{ color: "var(--gold)" }}>Faire une nouvelle demande →</Link></div>
                </div>
            </div>
        );
    }

    return (
        <div style={s.page}>
            <div style={s.bg} />
            <div className="auth-card" style={s.card}>
                <h1 style={s.logo}>CINEMAX</h1>
                <p style={s.tagline}>Votre univers cinématographique</p>
                <h2 style={s.title}>Nouveau mot de passe</h2>

                {error && <div style={s.errorBox}>{error}</div>}

                <form onSubmit={handleSubmit} style={s.form}>
                    <input
                        style={s.input}
                        type="password"
                        placeholder="Nouveau mot de passe"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <input
                        style={s.input}
                        type="password"
                        placeholder="Confirmer le mot de passe"
                        value={password2}
                        onChange={e => setPassword2(e.target.value)}
                        required
                    />
                    <p style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                        Min. 6 caractères, au moins un chiffre.
                    </p>
                    <button style={s.btn} type="submit" disabled={loading}>
                        {loading ? "Mise à jour..." : "Réinitialiser le mot de passe"}
                    </button>
                </form>

                <p style={s.link}>
                    <Link to="/login" style={{ color: "var(--gold)" }}>← Retour à la connexion</Link>
                </p>
            </div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    page:     { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: "1rem" },
    bg:       { position: "fixed", inset: 0, background: "linear-gradient(135deg, #0a0a0a 0%, #1a1208 50%, #0a0a0a 100%)", zIndex: -1 },
    card:     { background: "rgba(10,10,10,0.95)", border: "1px solid var(--gold-dark)", borderRadius: 8, backdropFilter: "blur(20px)" },
    logo:     { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 5vw, 2.5rem)", color: "var(--gold)", letterSpacing: "0.3em", textAlign: "center", fontWeight: 300 },
    tagline:  { color: "var(--text-muted)", textAlign: "center", fontSize: "0.72rem", letterSpacing: "0.2em", marginTop: "0.25rem", marginBottom: "2rem", textTransform: "uppercase" },
    title:    { fontSize: "1.2rem", fontWeight: 400, marginBottom: "1.25rem", color: "var(--text)" },
    errorBox: { background: "rgba(192,57,43,0.15)", border: "1px solid var(--red)", borderRadius: 4, padding: "0.65rem", marginBottom: "1rem", color: "#e74c3c", fontSize: "0.85rem" },
    form:     { display: "flex", flexDirection: "column", gap: "0.875rem" },
    input:    { background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 4, padding: "0.85rem 1rem", color: "var(--text)", fontSize: "0.95rem", outline: "none" },
    btn:      { background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#0a0a0a", fontWeight: 600, padding: "0.875rem", borderRadius: 4, fontSize: "0.95rem", letterSpacing: "0.05em", marginTop: "0.25rem", cursor: "pointer", border: "none" },
    link:     { textAlign: "center", marginTop: "1.25rem", color: "var(--text-muted)", fontSize: "0.875rem" },
};
