import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieRow from "../components/MovieRow";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { useResponsive } from "../hooks/useResponsive";

export default function HomePage() {
    const navigate  = useNavigate();
    const { user }  = useAuth();
    const { isMobile, isTablet } = useResponsive();

    // Données
    const [trending,   setTrending]   = useState<any[]>([]);
    const [popular,    setPopular]    = useState<any[]>([]);
    const [topRated,   setTopRated]   = useState<any[]>([]);
    const [nowPlaying, setNowPlaying] = useState<any[]>([]);
    const [forYou,     setForYou]     = useState<any[]>([]);
    const [continueW,  setContinueW]  = useState<any[]>([]);

    // Hero carousel
    const [heroIdx,    setHeroIdx]   = useState(0);
    const [heroAnim,   setHeroAnim]  = useState(false);
    const heroTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        (api.getTrending() as Promise<any>).then(d => setTrending(d.results || []));
        (api.getPopularMovies()  as Promise<any>).then(d => setPopular(d.results || []));
        (api.getTopRated()       as Promise<any>).then(d => setTopRated(d.results || []));
        (api.getNowPlaying()     as Promise<any>).then(d => setNowPlaying(d.results || []));
    }, []);

    useEffect(() => {
        const genres: number[] = (user as any)?.preferences?.genres;
        if (genres?.length) {
            (api.discover(genres) as Promise<any>).then(d => setForYou(d.results || [])).catch(() => {});
        }
        if (user) {
            (api.getHistory() as Promise<any[]>).then(h => {
                // Déduplique par tmdbId, garde les 12 plus récents
                const seen = new Set<number>();
                const unique = h.filter(item => seen.has(item.tmdbId) ? false : (seen.add(item.tmdbId), true));
                setContinueW(unique.slice(0, 12).map(h => ({
                    id: h.tmdbId, title: h.title, poster_path: h.posterPath,
                    vote_average: 0, media_type: h.mediaType,
                })));
            }).catch(() => {});
        }
    }, [user]);

    // Auto-rotation du hero toutes les 6 secondes
    const heroCount = Math.min(5, trending.length);
    useEffect(() => {
        if (!heroCount) return;
        heroTimerRef.current = setInterval(() => goHero("right", true), 6000);
        return () => { if (heroTimerRef.current) clearInterval(heroTimerRef.current); };
    }, [heroCount]);

    const goHero = (dir: "left" | "right", auto = false) => {
        if (heroAnim) return;
        if (!auto && heroTimerRef.current) {
            // Réinitialise le timer si l'utilisateur navigue manuellement
            clearInterval(heroTimerRef.current);
            heroTimerRef.current = setInterval(() => goHero("right", true), 6000);
        }
        setHeroAnim(true);
        setTimeout(() => {
            setHeroIdx(i => dir === "right" ? (i + 1) % heroCount : (i - 1 + heroCount) % heroCount);
            setHeroAnim(false);
        }, 350);
    };

    const hero = trending[heroIdx] || null;
    const username = user?.username;
    const heroHeight = isMobile ? "55vh" : isTablet ? "70vh" : "85vh";
    const contentPad = isMobile ? "1.5rem 1rem 3rem" : isTablet ? "2rem 2rem 4rem" : "2.5rem 3rem 5rem";

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
            <Navbar />

            {/* ── Hero carousel ───────────────────────────────────────────── */}
            {hero && (
                <div style={{ height: heroHeight, position: "relative", overflow: "hidden" }}>
                    {/* Image de fond avec transition */}
                    <div style={{
                        position: "absolute", inset: 0,
                        backgroundImage: `url(https://image.tmdb.org/t/p/original${hero.backdrop_path})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center top",
                        opacity: heroAnim ? 0 : 1,
                        transition: "opacity 0.35s ease",
                    }} />

                    {/* Gradient overlay */}
                    <div style={{
                        position: "absolute", inset: 0,
                        background: isMobile
                            ? "linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.5) 60%, transparent 100%)"
                            : "linear-gradient(to right, rgba(10,10,10,0.95) 30%, transparent 70%), linear-gradient(to top, rgba(10,10,10,1) 0%, transparent 40%)",
                        display: "flex",
                        alignItems: isMobile ? "flex-end" : "center",
                    }}>
                        <div className="hero-content-pad" style={{ paddingBottom: isMobile ? "1.5rem" : undefined }}>
                            <p style={s.heroLabel}>— À LA UNE</p>
                            <h1 style={{
                                ...s.heroTitle,
                                fontSize: isMobile ? "clamp(1.6rem, 7vw, 2.5rem)" : "clamp(2.5rem, 5vw, 4.5rem)",
                                opacity: heroAnim ? 0 : 1,
                                transform: heroAnim ? "translateY(10px)" : "translateY(0)",
                                transition: "opacity 0.35s ease, transform 0.35s ease",
                            }}>
                                {hero.title || hero.name}
                            </h1>
                            {!isMobile && (
                                <p style={{ ...s.heroOverview, opacity: heroAnim ? 0 : 1, transition: "opacity 0.35s ease" }}>
                                    {hero.overview?.slice(0, 200)}...
                                </p>
                            )}
                            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                                <button style={s.btnPrimary} onClick={() => navigate(`/movie/${hero.id}`)}>
                                    ▶ Voir les détails
                                </button>
                                {/* Flèches hero */}
                                <div style={{ display: "flex", gap: "0.4rem" }}>
                                    <button onClick={() => goHero("left")} style={s.heroArrow}>‹</button>
                                    <button onClick={() => goHero("right")} style={s.heroArrow}>›</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dots de navigation */}
                    <div style={{ position: "absolute", bottom: "1.25rem", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "0.4rem" }}>
                        {Array.from({ length: heroCount }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => { setHeroIdx(i); }}
                                style={{
                                    width: i === heroIdx ? "1.75rem" : "0.5rem",
                                    height: "0.5rem",
                                    borderRadius: "0.25rem",
                                    background: i === heroIdx ? "var(--gold)" : "rgba(255,255,255,0.3)",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: 0,
                                    transition: "width 0.3s ease, background 0.3s ease",
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* ── Rangées de films ─────────────────────────────────────────── */}
            <div className="large-container" style={{ padding: contentPad }}>
                {/* Continuer à regarder (si connecté et a un historique) */}
                {user && continueW.length > 0 && (
                    <MovieRow title="▶ Continuer à regarder" movies={continueW} />
                )}
                {/* Sélection personnalisée */}
                {user && username && forYou.length > 0 && (
                    <MovieRow title={`✦ Sélection pour ${username}`} movies={forYou} />
                )}
                <MovieRow title="Tendances de la semaine" movies={trending} />
                <MovieRow title="Nouveautés en salle"    movies={nowPlaying} />
                <MovieRow title="Films populaires"       movies={popular} />
                <MovieRow title="Les mieux notés"        movies={topRated} />
            </div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    heroLabel:    { color: "var(--gold)", fontSize: "0.7rem", letterSpacing: "0.3em", marginBottom: "0.75rem", fontWeight: 500 },
    heroTitle:    { fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, lineHeight: 1.1, marginBottom: "1rem", color: "var(--text)" },
    heroOverview: { fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "1.75rem", maxWidth: 480 },
    btnPrimary:   { background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#0a0a0a", fontWeight: 600, padding: "0.75rem 1.75rem", borderRadius: 4, fontSize: "0.875rem", letterSpacing: "0.05em", cursor: "pointer", border: "none" },
    heroArrow:    { background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", fontSize: "1.4rem", width: "2rem", height: "2rem", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, paddingBottom: "2px" },
};
