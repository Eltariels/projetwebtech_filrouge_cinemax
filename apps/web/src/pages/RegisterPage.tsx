import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AuthLayout from "../components/AuthLayout";

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email,    setEmail]    = useState("");
    const [password, setPassword] = useState("");
    const [error,    setError]    = useState("");
    const [loading,  setLoading]  = useState(false);

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
        <AuthLayout>
            <h1 style={s.logo}>CINEMAX</h1>
            <p style={s.tagline}>Votre univers cinématographique</p>
            <h2 style={s.title}>Créer un compte</h2>

            {error && <div style={s.error}>{error}</div>}

            <form onSubmit={handleSubmit} style={s.form}>
                <input style={s.input} type="text" placeholder="Nom d'utilisateur"
                    value={username} onChange={e => setUsername(e.target.value)} required />
                <input style={s.input} type="email" placeholder="Email"
                    value={email} onChange={e => setEmail(e.target.value)} required />
                <input style={s.input} type="password" placeholder="Mot de passe"
                    value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                <button style={s.btn} type="submit" disabled={loading}>
                    {loading ? "Création..." : "Créer mon compte"}
                </button>
            </form>

            <p style={s.link}>
                Déjà un compte ?{" "}
                <Link to="/login" style={{ color: "var(--gold)" }}>Se connecter</Link>
            </p>
        </AuthLayout>
    );
}

const s: Record<string, React.CSSProperties> = {
    logo:    { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 5vw, 2.4rem)", color: "var(--gold)", letterSpacing: "0.3em", textAlign: "center", fontWeight: 300, marginBottom: 0 },
    tagline: { color: "var(--text-muted)", textAlign: "center", fontSize: "0.68rem", letterSpacing: "0.2em", marginTop: "0.25rem", marginBottom: "2.5rem", textTransform: "uppercase" },
    title:   { fontSize: "1.25rem", fontWeight: 400, marginBottom: "1.5rem", color: "var(--text)" },
    error:   { background: "rgba(192,57,43,0.12)", border: "1px solid rgba(192,57,43,0.4)", borderRadius: 6, padding: "0.7rem 1rem", marginBottom: "1rem", color: "#e74c3c", fontSize: "0.85rem" },
    form:    { display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "1rem" },
    input:   { background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: 6, padding: "0.9rem 1rem", color: "var(--text)", fontSize: "0.95rem", outline: "none", transition: "border-color 0.2s" },
    btn:     { background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#0a0a0a", fontWeight: 600, padding: "0.9rem", borderRadius: 6, fontSize: "0.95rem", letterSpacing: "0.05em", marginTop: "0.25rem", cursor: "pointer", border: "none" },
    link:    { textAlign: "center", marginTop: "0.75rem", color: "var(--text-muted)", fontSize: "0.875rem" },
};
