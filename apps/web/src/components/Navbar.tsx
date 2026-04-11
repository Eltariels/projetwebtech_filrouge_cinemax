import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useResponsive } from "../hooks/useResponsive";

export default function Navbar() {
    const { user, logout }   = useAuth();
    const { theme, toggle }  = useTheme();
    const navigate           = useNavigate();
    const { isMobile, isTablet } = useResponsive();
    const [search, setSearch]       = useState("");
    const [searchOpen, setSearchOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/search?q=${encodeURIComponent(search.trim())}`);
            setSearchOpen(false);
            setSearch("");
        }
    };

    const compact = isMobile || isTablet;

    return (
        <nav style={{
            ...s.nav,
            background: theme === "light"
                ? "rgba(245,240,232,0.97)"
                : "linear-gradient(to bottom, rgba(10,10,10,0.98), rgba(10,10,10,0.95))",
            padding: isMobile ? "0 1rem" : isTablet ? "0 1.5rem" : "0 2rem",
            flexWrap: isMobile ? "wrap" : "nowrap",
            height: isMobile && searchOpen ? "auto" : 64,
        }}>
            {/* Logo */}
            <Link to="/" style={{ ...s.logo, fontSize: isMobile ? "1.1rem" : "1.5rem" }}>
                CINEMAX
            </Link>

            {/* Barre de recherche desktop / tablette */}
            {!isMobile && (
                <form onSubmit={handleSearch} style={{ ...s.searchForm, maxWidth: isTablet ? 220 : 320 }}>
                    <input
                        style={{ ...s.searchInput, background: theme === "light" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)" }}
                        placeholder="Rechercher un film, acteur..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </form>
            )}

            {/* Droite */}
            <div style={{ ...s.right, marginLeft: "auto", gap: isMobile ? "0.4rem" : "0.75rem" }}>
                {/* Toggle thème */}
                <button onClick={toggle} style={s.themeBtn} title={theme === "dark" ? "Thème clair" : "Thème sombre"} aria-label="Changer le thème">
                    {theme === "dark" ? "☀️" : "🌙"}
                </button>

                {/* Icône recherche mobile */}
                {isMobile && (
                    <button onClick={() => setSearchOpen(o => !o)} style={s.iconBtn} aria-label="Rechercher">
                        {searchOpen ? "✕" : "🔍"}
                    </button>
                )}

                {user ? (
                    <>
                        {!compact && (user as any).role === "admin" && (
                            <Link to="/admin" style={{ ...s.link, color: "var(--gold)" }}>⚙ Admin</Link>
                        )}
                        {!compact && <Link to="/profile" style={s.link}>Ma liste</Link>}
                        <Link to="/profile" style={s.avatar} title={user.username}>
                            {(user as any).avatar
                                ? <span style={{ fontSize: "1.1rem" }}>{(user as any).avatar}</span>
                                : user.username[0].toUpperCase()
                            }
                        </Link>
                        {!compact && (
                            <button onClick={() => { logout(); navigate("/"); }} style={s.logoutBtn}>Déconnexion</button>
                        )}
                        {compact && (
                            <button onClick={() => { logout(); navigate("/"); }} style={{ ...s.logoutBtn, padding: "0.35rem 0.6rem", fontSize: "0.75rem" }}>⏻</button>
                        )}
                    </>
                ) : (
                    <>
                        {!isMobile && <Link to="/login" style={s.link}>Connexion</Link>}
                        <Link to="/register" style={{ ...s.btnGold, padding: isMobile ? "0.4rem 0.9rem" : "0.5rem 1.25rem", fontSize: isMobile ? "0.8rem" : "0.875rem" }}>
                            {isMobile ? "Entrer" : "S'inscrire"}
                        </Link>
                    </>
                )}
            </div>

            {/* Barre de recherche mobile dépliable */}
            {isMobile && searchOpen && (
                <form onSubmit={handleSearch} style={{ width: "100%", padding: "0.5rem 0 0.75rem" }}>
                    <input
                        autoFocus
                        style={{ ...s.searchInput, width: "100%", boxSizing: "border-box" }}
                        placeholder="Rechercher un film, acteur..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </form>
            )}
        </nav>
    );
}

const s: Record<string, React.CSSProperties> = {
    nav: {
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", gap: "1rem",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--nav-border, rgba(201,168,76,0.1))",
        transition: "height 0.2s, background 0.3s",
    },
    logo:        { fontFamily: "'Cormorant Garamond', serif", color: "var(--gold)", letterSpacing: "0.3em", fontWeight: 300, flexShrink: 0 },
    searchForm:  { flex: 1 },
    searchInput: { width: "100%", border: "1px solid var(--border)", borderRadius: 4, padding: "0.5rem 1rem", color: "var(--text)", fontSize: "0.875rem", outline: "none" },
    right:       { display: "flex", alignItems: "center" },
    link:        { color: "var(--text-muted)", fontSize: "0.875rem", letterSpacing: "0.05em", whiteSpace: "nowrap" },
    avatar:      { width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", display: "flex", alignItems: "center", justifyContent: "center", color: "#0a0a0a", fontWeight: 700, fontSize: "0.875rem", flexShrink: 0 },
    logoutBtn:   { background: "none", color: "var(--text-muted)", fontSize: "0.8rem", padding: "0.4rem 0.75rem", border: "1px solid var(--border)", borderRadius: 4, cursor: "pointer", whiteSpace: "nowrap" },
    btnGold:     { background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#0a0a0a", fontWeight: 600, borderRadius: 4, flexShrink: 0, display: "inline-block" },
    iconBtn:     { background: "none", border: "none", color: "var(--text-muted)", fontSize: "1.1rem", cursor: "pointer", padding: "0.25rem" },
    themeBtn:    { background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", padding: "0.25rem", lineHeight: 1 },
};
