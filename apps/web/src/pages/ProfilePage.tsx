import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { api } from "../lib/api";
import { useResponsive } from "../hooks/useResponsive";

// ── Système de badges ────────────────────────────────────────────────────────
const BADGES = [
    { id: "first",       emoji: "🎬", label: "Premier pas",       desc: "1er film consulté",           check: (_w: any[], _r: any[], h: any[], _p: any) => h.length >= 1 },
    { id: "cinephile10", emoji: "🌱", label: "Cinéphile en herbe", desc: "10 films consultés",          check: (_w: any[], _r: any[], h: any[], _p: any) => h.length >= 10 },
    { id: "cinephile50", emoji: "🎭", label: "Amateur éclairé",    desc: "50 films consultés",          check: (_w: any[], _r: any[], h: any[], _p: any) => h.length >= 50 },
    { id: "expert",      emoji: "🏆", label: "Expert",             desc: "100 films consultés",         check: (_w: any[], _r: any[], h: any[], _p: any) => h.length >= 100 },
    { id: "critic",      emoji: "⭐", label: "Critique",           desc: "5 films notés",               check: (_w: any[], r: any[], _h: any[], _p: any) => r.length >= 5 },
    { id: "collector",   emoji: "📚", label: "Collectionneur",     desc: "10 films en watchlist",       check: (w: any[], _r: any[], _h: any[], _p: any) => w.length >= 10 },
    { id: "adn",         emoji: "🧬", label: "ADN Cinéma",         desc: "Profil de goûts configuré",   check: (_w: any[], _r: any[], _h: any[], p: any) => !!(p?.genres?.length) },
    { id: "binge",       emoji: "🔥", label: "Binge Watcher",      desc: "20 films notés",              check: (_w: any[], r: any[], _h: any[], _p: any) => r.length >= 20 },
];

function BadgesSection({ watchlist, ratings, history, prefs }: { watchlist: any[], ratings: any[], history: any[], prefs: any }) {
    const earned = BADGES.filter(b => b.check(watchlist, ratings, history, prefs));
    const locked = BADGES.filter(b => !b.check(watchlist, ratings, history, prefs));
    return (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: 8, padding: "1.25rem", marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 400, color: "var(--gold)", marginBottom: "1rem" }}>
                🏅 Badges
            </h2>
            {earned.length === 0 && (
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Commence à explorer pour débloquer des badges !</p>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: locked.length ? "1rem" : 0 }}>
                {earned.map(b => (
                    <div key={b.id} title={b.desc} style={{ background: "rgba(201,168,76,0.1)", border: "1px solid var(--gold-dark)", borderRadius: 8, padding: "0.6rem 0.9rem", textAlign: "center", minWidth: 90 }}>
                        <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>{b.emoji}</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--gold)", fontWeight: 500 }}>{b.label}</div>
                        <div style={{ fontSize: "0.62rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>{b.desc}</div>
                    </div>
                ))}
            </div>
            {locked.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {locked.map(b => (
                        <div key={b.id} title={`À débloquer : ${b.desc}`} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: 8, padding: "0.5rem 0.75rem", textAlign: "center", minWidth: 80, opacity: 0.4 }}>
                            <div style={{ fontSize: "1.2rem", marginBottom: "0.2rem", filter: "grayscale(1)" }}>{b.emoji}</div>
                            <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{b.label}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Sélecteur d'avatar emoji ─────────────────────────────────────────────────
const AVATARS = ["🎬","🎭","🎞️","🍿","🎥","🎦","⭐","🌟","🏆","🦁","🐉","🌙","🔥","💫","🎪","🧙","🦸","👽","🤖","🧛"];

function AvatarPicker({ current, onSave }: { current: string; onSave: (a: string) => void }) {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ position: "relative" }}>
            <button onClick={() => setOpen(o => !o)} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 4, padding: "0.3rem 0.6rem", color: "var(--gold)", fontSize: "0.75rem", cursor: "pointer" }}>
                ✏️ Changer l'avatar
            </button>
            {open && (
                <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: 8, padding: "0.75rem", zIndex: 50, display: "flex", flexWrap: "wrap", gap: "0.4rem", width: 240, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
                    {AVATARS.map(a => (
                        <button
                            key={a}
                            onClick={() => { onSave(a); setOpen(false); }}
                            style={{ fontSize: "1.4rem", background: a === current ? "rgba(201,168,76,0.2)" : "none", border: a === current ? "1px solid var(--gold)" : "1px solid transparent", borderRadius: 4, padding: "0.2rem 0.3rem", cursor: "pointer" }}
                        >
                            {a}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";

const DECADE_LABELS:  Record<string, string> = { "50s-60s": "50s–60s 🎞️", "70s": "70s 🕺", "80s": "80s 📼", "90s": "90s 💿", "2000s": "2000s 📀", "2010s": "2010s 📱", "2020s": "2020s 🚀" };
const AMBIANCE_LABELS:Record<string, string> = { "feel-good": "Feel-good ☀️", "dark": "Sombre 🌑", "epic": "Épique ⚔️", "intimate": "Intimiste 🕯️", "comedy": "Comédie 😂", "thrilling": "Frissons 😱", "romantic": "Romantique ❤️" };
const RHYTHM_LABELS:  Record<string, string> = { "slow": "Contemplatif 🌊", "balanced": "Équilibré ⚖️", "fast": "Action ⚡" };
const ORIGIN_LABELS:  Record<string, string> = { "hollywood": "Hollywood 🎬", "french": "Français 🥖", "european": "Européen 🏰", "asian": "Asiatique 🏯", "latin": "Latino 🌴", "world": "Monde entier 🌍" };
const GENRE_LABELS:   Record<number, string> = { 28: "Action 💥", 12: "Aventure 🗺️", 16: "Animation ✨", 35: "Comédie 🎭", 80: "Crime 🔫", 99: "Docu 🎥", 18: "Drame 🎪", 10751: "Famille 👨‍👩‍👧", 14: "Fantastique 🧙", 36: "Histoire 📜", 27: "Horreur 👻", 10749: "Romance 💑", 878: "Sci-Fi 🛸", 53: "Thriller 🔪", 10752: "Guerre 🪖" };
const GOLD = "#c9a84c";
const CHART_COLORS = [GOLD, "#a07830", "#e8c070", "#7a5820", "#d4a840", "#f0d080", "#906020"];

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

// ── Onglet statistiques ──────────────────────────────────────────────────────

function StatsTab({ ratings, history, watchlist, prefs }: { ratings: any[], history: any[], watchlist: any[], prefs: any }) {
    // Genres les plus notés (depuis les ratings)
    const genreCount: Record<string, number> = {};
    ratings.forEach(r => {
        if (r.mediaType === "movie") {
            const label = GENRE_LABELS[r.score] || "Autre";
            // On utilise le score pour simuler un genre fictif dans les stats — on utilise le tmdbId pour avoir de la variété
        }
    });

    // Données pour le radar ADN
    const radarData = prefs ? [
        { subject: "Genres",    A: (prefs.genres?.length  || 0) * 20 },
        { subject: "Ambiances", A: (prefs.ambiance?.length || 0) * 20 },
        { subject: "Époques",   A: (prefs.decades?.length  || 0) * 20 },
        { subject: "Cinémas",   A: (prefs.origins?.length  || 0) * 20 },
        { subject: "Rythme",    A: prefs.rhythm ? 80 : 0 },
    ] : [];

    // Répartition notes
    const scoreDistrib: Record<string, number> = {};
    ratings.forEach(r => {
        const bucket = r.score <= 3 ? "1-3" : r.score <= 5 ? "4-5" : r.score <= 7 ? "6-7" : "8-10";
        scoreDistrib[bucket] = (scoreDistrib[bucket] || 0) + 1;
    });
    const scoreData = Object.entries(scoreDistrib).map(([name, value]) => ({ name, value }));

    // Répartition films/séries dans l'historique
    const typeCount = history.reduce((acc, h) => {
        acc[h.mediaType === "tv" ? "Séries" : "Films"] = (acc[h.mediaType === "tv" ? "Séries" : "Films"] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const typeData = Object.entries(typeCount).map(([name, value]) => ({ name, value }));

    const statCard = (label: string, value: string | number, sub?: string) => (
        <div style={s.statCard}>
            <span style={s.statValue}>{value}</span>
            <span style={s.statLabel}>{label}</span>
            {sub && <span style={s.statSub}>{sub}</span>}
        </div>
    );

    return (
        <div>
            {/* KPIs */}
            <div style={s.statsGrid}>
                {statCard("Films vus", history.filter(h => h.mediaType !== "tv").length)}
                {statCard("Séries vues", history.filter(h => h.mediaType === "tv").length)}
                {statCard("Films notés", ratings.length)}
                {statCard("Watchlist", watchlist.length, "à voir")}
            </div>

            {/* Note moyenne */}
            {ratings.length > 0 && (
                <div style={{ ...s.statCard, width: "100%", marginBottom: "1.5rem", flexDirection: "row", gap: "0.75rem", alignItems: "center" }}>
                    <span style={{ ...s.statValue, fontSize: "2rem" }}>
                        ★ {(ratings.reduce((s, r) => s + r.score, 0) / ratings.length).toFixed(1)}
                    </span>
                    <span style={s.statLabel}>Note moyenne sur {ratings.length} film{ratings.length > 1 ? "s" : ""}</span>
                </div>
            )}

            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                {/* Pie chart répartition types */}
                {typeData.length > 0 && (
                    <div style={s.chartBox}>
                        <p style={s.chartTitle}>Films vs Séries consultés</p>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={typeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                                    {typeData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #c9a84c", borderRadius: 4, color: "#e8e0d0" }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Pie chart distribution des notes */}
                {scoreData.length > 0 && (
                    <div style={s.chartBox}>
                        <p style={s.chartTitle}>Distribution de tes notes</p>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={scoreData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} — ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                                    {scoreData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #c9a84c", borderRadius: 4, color: "#e8e0d0" }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Radar ADN Cinéma */}
                {radarData.length > 0 && radarData.some(d => d.A > 0) && (
                    <div style={s.chartBox}>
                        <p style={s.chartTitle}>Profil ADN Cinéma</p>
                        <ResponsiveContainer width="100%" height={220}>
                            <RadarChart data={radarData}>
                                <PolarGrid stroke="rgba(201,168,76,0.2)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: "#b0a090", fontSize: 12 }} />
                                <Radar name="ADN" dataKey="A" stroke={GOLD} fill={GOLD} fillOpacity={0.25} />
                                <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #c9a84c", borderRadius: 4, color: "#e8e0d0" }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {ratings.length === 0 && history.length === 0 && (
                <p style={s.empty}>Note des films et explore du contenu pour voir tes statistiques ici.</p>
            )}
        </div>
    );
}

// ── Page principale ──────────────────────────────────────────────────────────

export default function ProfilePage() {
    const { user, logout, isLoading, setUser } = useAuth();
    const navigate                    = useNavigate();
    const { toast }                   = useToast();
    const { isMobile, isTablet }      = useResponsive();
    const [watchlist, setWatchlist]   = useState<any[]>([]);
    const [ratings,   setRatings]     = useState<any[]>([]);
    const [history,   setHistory]     = useState<any[]>([]);
    const [tab, setTab]               = useState<"watchlist" | "ratings" | "history" | "stats" | "badges">("watchlist");

    useEffect(() => {
        if (!isLoading && !user) { navigate("/login"); return; }
        (api.getWatchlist() as Promise<any[]>).then(setWatchlist).catch(() => {});
        (api.getRatings()   as Promise<any[]>).then(setRatings).catch(() => {});
        (api.getHistory()   as Promise<any[]>).then(setHistory).catch(() => {});
    }, [user, isLoading]);

    const handleLogout = () => { logout(); navigate("/login"); };

    const clearHistory = async () => {
        await api.clearHistory();
        setHistory([]);
        toast("Historique effacé", "info");
    };

    // ── Sauvegarde de l'avatar ───────────────────────────────────────────────
    const saveAvatar = async (avatar: string) => {
        try {
            const updated = await api.updateProfile({ username: user?.username, avatar }) as any;
            setUser(updated);
            toast("Avatar mis à jour !");
        } catch (err: any) { toast(err.message, "error"); }
    };

    // ── Mode soirée : film aléatoire de la watchlist ─────────────────────────
    const randomFromWatchlist = () => {
        if (!watchlist.length) { toast("Ta watchlist est vide !", "error"); return; }
        const pick = watchlist[Math.floor(Math.random() * watchlist.length)];
        navigate(`/movie/${pick.tmdbId}?type=${pick.mediaType || "movie"}`);
    };

    const prefs      = (user as any)?.preferences;
    const contentPad = isMobile ? "5rem 1rem 3rem" : isTablet ? "6rem 2rem 3rem" : "6rem 3rem 4rem";

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
            <Navbar />
            <div className="large-container" style={{ padding: contentPad }}>

                {/* Header profil */}
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem", flexDirection: isMobile ? "column" : "row", textAlign: isMobile ? "center" : "left", flexWrap: "wrap" }}>
                    <div style={{ position: "relative" }}>
                        <div style={s.avatar}>
                            {(user as any)?.avatar
                                ? <span style={{ fontSize: "1.8rem" }}>{(user as any).avatar}</span>
                                : user?.username?.[0]?.toUpperCase()
                            }
                        </div>
                        <div style={{ position: "absolute", bottom: -6, right: -6 }}>
                            <AvatarPicker current={(user as any)?.avatar || ""} onSave={saveAvatar} />
                        </div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "2rem" : "2.5rem", fontWeight: 300, color: "var(--text)" }}>{user?.username}</h1>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.2rem" }}>{user?.email}</p>
                        <div style={{ display: "flex", gap: "1.25rem", marginTop: "0.65rem", justifyContent: isMobile ? "center" : "flex-start" }}>
                            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}><strong style={{ color: "var(--gold)" }}>{watchlist.length}</strong> à voir</span>
                            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}><strong style={{ color: "var(--gold)" }}>{ratings.length}</strong> notés</span>
                            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}><strong style={{ color: "var(--gold)" }}>{history.length}</strong> vus</span>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: isMobile ? "center" : "flex-end" }}>
                        {/* Mode soirée */}
                        <button onClick={randomFromWatchlist} style={s.soireeBtn} title="Film aléatoire de ta watchlist">
                            🎲 Soirée surprise
                        </button>
                        <button onClick={handleLogout} style={s.logoutBtn}>Déconnexion</button>
                    </div>
                </div>

                {/* ADN Cinéma */}
                <ADNCinema prefs={prefs} />

                {/* Badges */}
                <BadgesSection watchlist={watchlist} ratings={ratings} history={history} prefs={prefs} />

                {/* Onglets */}
                <div style={s.tabs}>
                    {(["watchlist", "ratings", "history", "stats", "badges"] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)} style={{ ...s.tab, ...(tab === t ? s.tabActive : {}) }}>
                            {t === "watchlist" ? "Ma Watchlist" : t === "ratings" ? "Mes Notes" : t === "history" ? "Historique" : t === "stats" ? "Statistiques" : "Badges"}
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

                {tab === "history" && (
                    <div>
                        {history.length > 0 && (
                            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
                                <button onClick={clearHistory} style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "0.4rem 0.9rem", borderRadius: 4, cursor: "pointer", fontSize: "0.8rem" }}>
                                    ✕ Effacer l'historique
                                </button>
                            </div>
                        )}
                        <div style={s.grid}>
                            {history.length
                                ? history.map(h => <MovieCard key={`${h.tmdbId}-${h.visitedAt}`} movie={{ id: h.tmdbId, title: h.title, poster_path: h.posterPath, vote_average: 0, media_type: h.mediaType }} />)
                                : <p style={s.empty}>Aucun film consulté récemment.</p>}
                        </div>
                    </div>
                )}

                {tab === "stats" && (
                    <StatsTab ratings={ratings} history={history} watchlist={watchlist} prefs={prefs} />
                )}

                {tab === "badges" && (
                    <BadgesSection watchlist={watchlist} ratings={ratings} history={history} prefs={prefs} />
                )}
            </div>
        </div>
    );
}

const tagStyle: React.CSSProperties = { background: "rgba(201,168,76,0.1)", border: "1px solid var(--gold-dark)", color: "var(--gold)", borderRadius: 20, padding: "0.2rem 0.7rem", fontSize: "0.78rem", whiteSpace: "nowrap" };

const s: Record<string, React.CSSProperties> = {
    avatar:      { width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem", color: "#0a0a0a", fontWeight: 700, flexShrink: 0 },
    logoutBtn:   { background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "0.55rem 1.1rem", borderRadius: 4, cursor: "pointer", fontSize: "0.85rem", whiteSpace: "nowrap" },
    soireeBtn:   { background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.3)", color: "var(--gold)", padding: "0.55rem 1.1rem", borderRadius: 4, cursor: "pointer", fontSize: "0.85rem", whiteSpace: "nowrap", fontWeight: 500 },
    adnCard:     { background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: 8, padding: "1.25rem", marginBottom: "2rem" },
    adnHeader:   { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" },
    adnTitle:    { fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 400, color: "var(--gold)" },
    editPrefsBtn:{ background: "none", border: "1px solid var(--gold-dark)", color: "var(--gold)", padding: "0.35rem 0.8rem", borderRadius: 4, fontSize: "0.78rem", cursor: "pointer" },
    adnSections: { display: "flex", flexDirection: "column", gap: "0.85rem" },
    adnLabel:    { fontSize: "0.68rem", color: "var(--text-muted)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.4rem" },
    tagRow:      { display: "flex", flexWrap: "wrap", gap: "0.4rem" },
    tabs:        { display: "flex", marginBottom: "1.75rem", borderBottom: "1px solid var(--border)", overflowX: "auto" },
    tab:         { background: "none", color: "var(--text-muted)", padding: "0.8rem 1.25rem", fontSize: "0.875rem", borderBottom: "2px solid transparent", marginBottom: -1, transition: "all 0.2s", cursor: "pointer", whiteSpace: "nowrap" },
    tabActive:   { color: "var(--gold)", borderBottomColor: "var(--gold)" },
    grid:        { display: "flex", flexWrap: "wrap", gap: "0.75rem" },
    empty:       { color: "var(--text-muted)", fontStyle: "italic" },
    ratingBadge: { position: "absolute", top: 6, right: 6, background: "rgba(10,10,10,0.9)", border: "1px solid var(--gold-dark)", color: "var(--gold)", borderRadius: 4, padding: "0.15rem 0.45rem", fontSize: "0.65rem", fontWeight: 600 },
    // Stats
    statsGrid:   { display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" },
    statCard:    { background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 8, padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.25rem", minWidth: 120 },
    statValue:   { color: "var(--gold)", fontSize: "1.75rem", fontWeight: 600, fontFamily: "'Cormorant Garamond', serif" },
    statLabel:   { color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" },
    statSub:     { color: "var(--text-muted)", fontSize: "0.7rem" },
    chartBox:    { background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: 8, padding: "1rem", flex: "1 1 260px", minWidth: 260 },
    chartTitle:  { color: "var(--gold)", fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" },
};
