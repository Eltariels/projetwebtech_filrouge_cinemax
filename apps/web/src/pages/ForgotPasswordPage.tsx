import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export default function ForgotPasswordPage() {
    const [email,   setEmail]   = useState("");
    const [message, setMessage] = useState("");
    const [error,   setError]   = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(""); setMessage(""); setLoading(true);
        try {
            await api.forgotPassword(email);
            setMessage("Si cet email existe, un lien de réinitialisation a été envoyé. Vérifie ta boîte mail.");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={s.page}>
            <div style={s.bg} />
            <div className="auth-card" style={s.card}>
                <h1 style={s.logo}>CINEMAX</h1>
                <p style={s.tagline}>Votre univers cinématographique</p>
                <h2 style={s.title}>Mot de passe oublié</h2>
                <p style={s.desc}>Saisis ton adresse email et nous t'enverrons un lien pour réinitialiser ton mot de passe.</p>

                {error   && <div style={s.error}>{error}</div>}
                {message && <div style={s.success}>{message}</div>}

                {!message && (
                    <form onSubmit={handleSubmit} style={s.form}>
                        <input
                            style={s.input}
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <button style={s.btn} type="submit" disabled={loading}>
                            {loading ? "Envoi..." : "Envoyer le lien"}
                        </button>
                    </form>
                )}

                <p style={s.link}>
                    <Link to="/login" style={{ color: "var(--gold)" }}>← Retour à la connexion</Link>
                </p>
            </div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    page:    { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: "1rem" },
    bg:      { position: "fixed", inset: 0, background: "linear-gradient(135deg, #0a0a0a 0%, #1a1208 50%, #0a0a0a 100%)", zIndex: -1 },
    card:    { background: "rgba(10,10,10,0.95)", border: "1px solid var(--gold-dark)", borderRadius: 8, backdropFilter: "blur(20px)" },
    logo:    { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 5vw, 2.5rem)", color: "var(--gold)", letterSpacing: "0.3em", textAlign: "center", fontWeight: 300 },
    tagline: { color: "var(--text-muted)", textAlign: "center", fontSize: "0.72rem", letterSpacing: "0.2em", marginTop: "0.25rem", marginBottom: "2rem", textTransform: "uppercase" },
    title:   { fontSize: "1.2rem", fontWeight: 400, marginBottom: "0.5rem", color: "var(--text)" },
    desc:    { color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.6, marginBottom: "1.5rem" },
    error:   { background: "rgba(192,57,43,0.15)", border: "1px solid var(--red)", borderRadius: 4, padding: "0.65rem", marginBottom: "1rem", color: "#e74c3c", fontSize: "0.85rem" },
    success: { background: "rgba(39,174,96,0.1)", border: "1px solid rgba(39,174,96,0.4)", borderRadius: 4, padding: "0.75rem", marginBottom: "1rem", color: "#27ae60", fontSize: "0.875rem", lineHeight: 1.5 },
    form:    { display: "flex", flexDirection: "column", gap: "0.875rem" },
    input:   { background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 4, padding: "0.85rem 1rem", color: "var(--text)", fontSize: "0.95rem", outline: "none" },
    btn:     { background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#0a0a0a", fontWeight: 600, padding: "0.875rem", borderRadius: 4, fontSize: "0.95rem", letterSpacing: "0.05em", marginTop: "0.25rem", cursor: "pointer", border: "none" },
    link:    { textAlign: "center", marginTop: "1.25rem", color: "var(--text-muted)", fontSize: "0.875rem" },
};
