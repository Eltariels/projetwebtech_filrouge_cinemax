import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await register(username, email, password);
            navigate("/preferences");
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
                <h2 style={s.title}>Créer un compte</h2>
                {error && <div style={s.error}>{error}</div>}
                <form onSubmit={handleSubmit} style={s.form}>
                    <input style={s.input} type="text" placeholder="Nom d'utilisateur" value={username}
                           onChange={e => setUsername(e.target.value)} required />
                    <input style={s.input} type="email" placeholder="Email" value={email}
                           onChange={e => setEmail(e.target.value)} required />
                    <input style={s.input} type="password" placeholder="Mot de passe" value={password}
                           onChange={e => setPassword(e.target.value)} required minLength={6} />
                    <button style={s.btn} type="submit" disabled={loading}>
                        {loading ? "Création..." : "Créer mon compte"}
                    </button>
                </form>
                <p style={s.link}>
                    Déjà un compte ? <Link to="/login" style={{ color: "var(--gold)" }}>Se connecter</Link>
                </p>
            </div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: "1rem" },
    bg: { position: "fixed", inset: 0, background: "linear-gradient(135deg, #0a0a0a 0%, #1a1208 50%, #0a0a0a 100%)", zIndex: -1 },
    card: { background: "rgba(10,10,10,0.95)", border: "1px solid var(--gold-dark)", borderRadius: 8, backdropFilter: "blur(20px)" },
    logo: { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 5vw, 2.5rem)", color: "var(--gold)", letterSpacing: "0.3em", textAlign: "center", fontWeight: 300 },
    tagline: { color: "var(--text-muted)", textAlign: "center", fontSize: "0.72rem", letterSpacing: "0.2em", marginTop: "0.25rem", marginBottom: "2rem", textTransform: "uppercase" },
    title: { fontSize: "1.2rem", fontWeight: 400, marginBottom: "1.25rem", color: "var(--text)" },
    error: { background: "rgba(192,57,43,0.15)", border: "1px solid var(--red)", borderRadius: 4, padding: "0.65rem", marginBottom: "1rem", color: "#e74c3c", fontSize: "0.85rem" },
    form: { display: "flex", flexDirection: "column", gap: "0.875rem" },
    input: { background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 4, padding: "0.85rem 1rem", color: "var(--text)", fontSize: "0.95rem", outline: "none" },
    btn: { background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#0a0a0a", fontWeight: 600, padding: "0.875rem", borderRadius: 4, fontSize: "0.95rem", letterSpacing: "0.05em", marginTop: "0.25rem" },
    link: { textAlign: "center", marginTop: "1.25rem", color: "var(--text-muted)", fontSize: "0.875rem" },
};
