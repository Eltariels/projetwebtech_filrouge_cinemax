import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/api";
import { useResponsive } from "../hooks/useResponsive";

const DECADE_LABELS:  Record<string, string> = { "50s-60s": "50s–60s 🎞️", "70s": "70s 🕺", "80s": "80s 📼", "90s": "90s 💿", "2000s": "2000s 📀", "2010s": "2010s 📱", "2020s": "2020s 🚀" };
const AMBIANCE_LABELS:Record<string, string> = { "feel-good": "Feel-good ☀️", "dark": "Sombre 🌑", "epic": "Épique ⚔️", "intimate": "Intimiste 🕯️", "comedy": "Comédie 😂", "thrilling": "Frissons 😱", "romantic": "Romantique ❤️" };
const RHYTHM_LABELS:  Record<string, string> = { "slow": "Contemplatif 🌊", "balanced": "Équilibré ⚖️", "fast": "Action ⚡" };
const ORIGIN_LABELS:  Record<string, string> = { "hollywood": "Hollywood 🎬", "french": "Français 🥖", "european": "Européen 🏰", "asian": "Asiatique 🏯", "latin": "Latino 🌴", "world": "Monde entier 🌍" };
const GENRE_LABELS:   Record<number, string> = { 28: "Action 💥", 12: "Aventure 🗺️", 16: "Animation ✨", 35: "Comédie 🎭", 80: "Crime 🔫", 99: "Docu 🎥", 18: "Drame 🎪", 10751: "Famille 👨‍👩‍👧", 14: "Fantastique 🧙", 36: "Histoire 📜", 27: "Horreur 👻", 10749: "Romance 💑", 878: "Sci-Fi 🛸", 53: "Thriller 🔪", 10752: "Guerre 🪖" };

function Tag({ label }: { label: string }) {
    return <span style={tagStyle}>{label}</span>;
}

function ADNCinema({ prefs }: { prefs: any }) {
    const hasAny = prefs && (prefs.decades?.length || prefs.ambiance?.length || prefs.rhythm || prefs.origins?.length || prefs.genres?.length);
    return (
        <div style={s.adnCard}>
            <div style={s.adnHeader}>
                <h2 style={s.adnTitle}>🎬 ADN Cinéma</h2>
                <button style={s.editPrefsBtn} onClick={() => window.location.href = "/preferences"}>
                    {hasAny ? "Modifier" : "Configurer →"}
                </button>
            </div>
            {!hasAny ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Tu n'as pas encore défini tes préférences cinéma.</p>
            ) : (
                <div style={s.adnSections}>
                    {prefs.decades?.length  > 0 && <div><p style={s.adnLabel}>Époques</p>   <div style={s.tagRow}>{prefs.decades.map( (v: string) => <Tag key={v} label={DECADE_LABELS[v]  || v} />)}</div></div>}
                    {prefs.ambiance?.length > 0 && <div><p style={s.adnLabel}>Ambiances</p> <div style={s.tagRow}>{prefs.ambiance.map((v: string) => <Tag key={v} label={AMBIANCE_LABELS[v] || v} />)}</div></div>}
                    {prefs.rhythm           && <div><p style={s.adnLabel}>Rythme</p>    <div style={s.tagRow}><Tag label={RHYTHM_LABELS[prefs.rhythm] || prefs.rhythm} /></div></div>}
                    {prefs.origins?.length  > 0 && <div><p style={s.adnLabel}>Cinémas</p>  <div style={s.tagRow}>{prefs.origins.map( (v: string) => <Tag key={v} label={ORIGIN_LABELS[v]  || v} />)}</div></div>}
                    {prefs.genres?.length   > 0 && <div><p style={s.adnLabel}>Genres</p>   <div style={s.tagRow}>{prefs.genres.map(  (v: number) => <Tag key={v} label={GENRE_LABELS[v]   || String(v)} />)}</div></div>}
                </div>
            )}
        </div>
    );
}

export default function ProfilePage() {
    const { user, logout, isLoading } = useAuth();
    const navigate = useNavigate();
    const { isMobile, isTablet } = useResponsive();
    const [watchlist, setWatchlist] = useState<any[]>([]);
    const [ratings, setRatings]     = useState<any[]>([]);
    const [tab, setTab]             = useState<"watchlist" | "ratings">("watchlist");

    useEffect(() => {
        if (!isLoading && !user) { navigate("/login"); return; }
        (api.getWatchlist() as Promise<any[]>).then(setWatchlist).catch(() => {});
        (api.getRatings()   as Promise<any[]>).then(setRatings).catch(() => {});
    }, [user, isLoading]);

    const handleLogout = () => { logout(); navigate("/login"); };
    const prefs = (user as any)?.preferences;
    const contentPad = isMobile ? "5rem 1rem 3rem" : isTablet ? "6rem 2rem 3rem" : "6rem 3rem 4rem";

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
            <Navbar />
            <div className="large-container" style={{ padding: contentPad }}>

                {/* Header profil */}
                <div style={{ display: "flex", alignItems: isMobile ? "center" : "center", gap: "1.5rem", marginBottom: "2rem", flexDirection: isMobile ? "column" : "row", textAlign: isMobile ? "center" : "left", flexWrap: "wrap" }}>
                    <div style={s.avatar}>{user?.username?.[0]?.toUpperCase()}</div>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "2rem" : "2.5rem", fontWeight: 300, color: "var(--text)" }}>{user?.username}</h1>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.2rem" }}>{user?.email}</p>
                        <div style={{ display: "flex", gap: "1.25rem", marginTop: "0.65rem", justifyContent: isMobile ? "center" : "flex-start" }}>
                            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}><strong style={{ color: "var(--gold)" }}>{watchlist.length}</strong> à voir</span>
                            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}><strong style={{ color: "var(--gold)" }}>{ratings.length}</strong> notés</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={{ ...s.logoutBtn, marginLeft: isMobile ? 0 : "auto" }}>Déconnexion</button>
                </div>

                {/* ADN Cinéma */}
                <ADNCinema prefs={prefs} />

                {/* Onglets */}
                <div style={s.tabs}>
                    {(["watchlist", "ratings"] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)} style={{ ...s.tab, ...(tab === t ? s.tabActive : {}) }}>
                            {t === "watchlist" ? "Ma Watchlist" : "Mes Notes"}
                        </button>
                    ))}
                </div>

                {tab === "watchlist" && (
                    <div style={s.grid}>
                        {watchlist.length
                            ? watchlist.map(w => <MovieCard key={w.tmdbId} movie={{ id: w.tmdbId, title: w.title, poster_path: w.posterPath, vote_average: w.voteAverage, release_date: w.releaseDate }} />)
                            : <p style={s.empty}>Votre watchlist est vide.</p>}
                    </div>
                )}
                {tab === "ratings" && (
                    <div style={s.grid}>
                        {ratings.length
                            ? ratings.map(r => (
                                <div key={r.tmdbId} style={{ position: "relative" }}>
                                    <MovieCard movie={{ id: r.tmdbId, title: r.title, poster_path: r.posterPath, vote_average: r.score }} />
                                    <div style={s.ratingBadge}>★ {r.score}/10</div>
                                </div>
                            ))
                            : <p style={s.empty}>Vous n'avez encore noté aucun film.</p>}
                    </div>
                )}
            </div>
        </div>
    );
}

const tagStyle: React.CSSProperties = { background: "rgba(201,168,76,0.1)", border: "1px solid var(--gold-dark)", color: "var(--gold)", borderRadius: 20, padding: "0.2rem 0.7rem", fontSize: "0.78rem", whiteSpace: "nowrap" };

const s: Record<string, React.CSSProperties> = {
    avatar: { width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem", color: "#0a0a0a", fontWeight: 700, flexShrink: 0 },
    logoutBtn: { background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "0.55rem 1.1rem", borderRadius: 4, cursor: "pointer", fontSize: "0.85rem", whiteSpace: "nowrap" },
    adnCard: { background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: 8, padding: "1.25rem", marginBottom: "2rem" },
    adnHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" },
    adnTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 400, color: "var(--gold)" },
    editPrefsBtn: { background: "none", border: "1px solid var(--gold-dark)", color: "var(--gold)", padding: "0.35rem 0.8rem", borderRadius: 4, fontSize: "0.78rem", cursor: "pointer" },
    adnSections: { display: "flex", flexDirection: "column", gap: "0.85rem" },
    adnLabel: { fontSize: "0.68rem", color: "var(--text-muted)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.4rem" },
    tagRow: { display: "flex", flexWrap: "wrap", gap: "0.4rem" },
    tabs: { display: "flex", marginBottom: "1.75rem", borderBottom: "1px solid var(--border)" },
    tab: { background: "none", color: "var(--text-muted)", padding: "0.8rem 1.5rem", fontSize: "0.875rem", borderBottom: "2px solid transparent", marginBottom: -1, transition: "all 0.2s", cursor: "pointer" },
    tabActive: { color: "var(--gold)", borderBottomColor: "var(--gold)" },
    grid: { display: "flex", flexWrap: "wrap", gap: "0.75rem" },
    empty: { color: "var(--text-muted)", fontStyle: "italic" },
    ratingBadge: { position: "absolute", top: 6, right: 6, background: "rgba(10,10,10,0.9)", border: "1px solid var(--gold-dark)", color: "var(--gold)", borderRadius: 4, padding: "0.15rem 0.45rem", fontSize: "0.65rem", fontWeight: 600 },
};
