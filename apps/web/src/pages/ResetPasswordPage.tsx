import { useState, FormEvent } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import AuthLayout from "../components/AuthLayout";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate       = useNavigate();
    const token          = searchParams.get("token") || "";

    const [password,  setPassword]  = useState("");
    const [password2, setPassword2] = useState("");
    const [error,     setError]     = useState("");
    const [success,   setSuccess]   = useState(false);
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
            setSuccess(true);
            setTimeout(() => navigate("/login"), 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <AuthLayout>
                <h1 style={s.logo}>CINEMAX</h1>
                <div style={s.error}>
                    Lien invalide ou expiré.{" "}
                    <Link to="/forgot-password" style={{ color: "var(--gold)" }}>Faire une nouvelle demande →</Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <h1 style={s.logo}>CINEMAX</h1>
            <p style={s.tagline}>Votre univers cinématographique</p>
            <h2 style={s.title}>Nouveau mot de passe</h2>

            {error   && <div style={s.error}>{error}</div>}
            {success && <div style={s.success}>Mot de passe mis à jour ! Redirection...</div>}

            {!success && (
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
            )}

            <p style={s.link}>
                <Link to="/login" style={{ color: "var(--gold)" }}>← Retour à la connexion</Link>
            </p>
        </AuthLayout>
    );
}

const s: Record<string, React.CSSProperties> = {
    logo:    { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 5vw, 2.4rem)", color: "var(--gold)", letterSpacing: "0.3em", textAlign: "center", fontWeight: 300, marginBottom: 0 },
    tagline: { color: "var(--text-muted)", textAlign: "center", fontSize: "0.68rem", letterSpacing: "0.2em", marginTop: "0.25rem", marginBottom: "2.5rem", textTransform: "uppercase" },
    title:   { fontSize: "1.25rem", fontWeight: 400, marginBottom: "1.5rem", color: "var(--text)" },
    error:   { background: "rgba(192,57,43,0.12)", border: "1px solid rgba(192,57,43,0.4)", borderRadius: 6, padding: "0.7rem 1rem", marginBottom: "1rem", color: "#e74c3c", fontSize: "0.85rem" },
    success: { background: "rgba(39,174,96,0.1)", border: "1px solid rgba(39,174,96,0.4)", borderRadius: 6, padding: "0.75rem 1rem", marginBottom: "1rem", color: "#27ae60", fontSize: "0.875rem" },
    form:    { display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "1rem" },
    input:   { background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: 6, padding: "0.9rem 1rem", color: "var(--text)", fontSize: "0.95rem", outline: "none", transition: "border-color 0.2s" },
    btn:     { background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#0a0a0a", fontWeight: 600, padding: "0.9rem", borderRadius: 6, fontSize: "0.95rem", letterSpacing: "0.05em", marginTop: "0.25rem", cursor: "pointer", border: "none" },
    link:    { textAlign: "center", marginTop: "0.75rem", color: "var(--text-muted)", fontSize: "0.875rem" },
};
