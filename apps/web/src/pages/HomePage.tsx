import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieRow from "../components/MovieRow";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { useResponsive } from "../hooks/useResponsive";

export default function HomePage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { isMobile, isTablet } = useResponsive();
    const [hero, setHero] = useState<any>(null);
    const [trending, setTrending] = useState([]);
    const [popular, setPopular] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [forYou, setForYou] = useState([]);

    useEffect(() => {
        (api.getTrending() as Promise<any>).then(d => {
            setTrending(d.results || []);
            setHero(d.results?.[0]);
        });
        (api.getPopularMovies() as Promise<any>).then(d => setPopular(d.results || []));
        (api.getTopRated() as Promise<any>).then(d => setTopRated(d.results || []));
    }, []);

    useEffect(() => {
        const genres: number[] = (user as any)?.preferences?.genres;
        if (!genres?.length) return;
        (api.discover(genres) as Promise<any>)
            .then(d => setForYou(d.results || []))
            .catch(() => {});
    }, [user]);

    const username = user?.username;
    const hasPrefs = !!((user as any)?.preferences?.genres?.length);

    const heroHeight = isMobile ? "55vh" : isTablet ? "70vh" : "85vh";
    const contentPad = isMobile ? "1.5rem 1rem 3rem" : isTablet ? "2rem 2rem 4rem" : "2.5rem 3rem 5rem";

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
            <Navbar />

            {/* Hero banner */}
            {hero && (
                <div style={{
                    height: heroHeight,
                    backgroundImage: `url(https://image.tmdb.org/t/p/original${hero.backdrop_path})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center top",
                    position: "relative",
                }}>
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
                            <h1 style={{ ...s.heroTitle, fontSize: isMobile ? "clamp(1.6rem, 7vw, 2.5rem)" : "clamp(2.5rem, 5vw, 4.5rem)" }}>
                                {hero.title || hero.name}
                            </h1>
                            {!isMobile && (
                                <p style={s.heroOverview}>{hero.overview?.slice(0, 200)}...</p>
                            )}
                            <div style={s.heroActions}>
                                <button style={s.btnPrimary} onClick={() => navigate(`/movie/${hero.id}`)}>
                                    ▶ Voir les détails
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Rangées de films */}
            <div className="large-container" style={{ padding: contentPad }}>
                {hasPrefs && forYou.length > 0 && (
                    <MovieRow title={`✦ Sélection pour ${username}`} movies={forYou} />
                )}
                <MovieRow title="Tendances de la semaine" movies={trending} />
                <MovieRow title="Films populaires" movies={popular} />
                <MovieRow title="Les mieux notés" movies={topRated} />
            </div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    heroLabel: { color: "var(--gold)", fontSize: "0.7rem", letterSpacing: "0.3em", marginBottom: "0.75rem", fontWeight: 500 },
    heroTitle: { fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, lineHeight: 1.1, marginBottom: "1rem", color: "var(--text)" },
    heroOverview: { fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "1.75rem", maxWidth: 480 },
    heroActions: { display: "flex", gap: "1rem" },
    btnPrimary: { background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#0a0a0a", fontWeight: 600, padding: "0.75rem 1.75rem", borderRadius: 4, fontSize: "0.875rem", letterSpacing: "0.05em" },
};
