import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { useResponsive } from "../hooks/useResponsive";

export default function MoviePage() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { isMobile, isTablet } = useResponsive();
    const mediaType = searchParams.get("type") === "tv" ? "tv" : "movie";

    const [movie, setMovie] = useState<any>(null);
    const [inWatchlist, setInWatchlist] = useState(false);
    const [userRating, setUserRating] = useState<number>(0);
    const [review, setReview] = useState("");
    const [ratingMsg, setRatingMsg] = useState("");
    const [actionError, setActionError] = useState("");

    useEffect(() => {
        if (!id) return;
        const fetchMedia = mediaType === "tv" ? api.getTv(id) : api.getMovie(id);
        (fetchMedia as Promise<any>).then(setMovie);

        if (user) {
            (api.getRating(Number(id)) as Promise<any>).then(r => {
                if (r) { setUserRating(r.score); setReview(r.review || ""); }
            }).catch(() => {});
            (api.getWatchlist() as Promise<any[]>).then(list => {
                setInWatchlist(list.some((w: any) => w.tmdbId === Number(id)));
            }).catch(() => {});
        }
    }, [id, mediaType, user]);

    const toggleWatchlist = async () => {
        if (!user) { navigate("/login"); return; }
        if (!movie) return;
        setActionError("");
        try {
            if (inWatchlist) {
                await api.removeFromWatchlist(movie.id);
                setInWatchlist(false);
            } else {
                await api.addToWatchlist({
                    tmdbId: movie.id, mediaType,
                    title: movie.title || movie.name,
                    posterPath: movie.poster_path,
                    overview: movie.overview,
                    releaseDate: movie.release_date || movie.first_air_date,
                    voteAverage: movie.vote_average,
                });
                setInWatchlist(true);
            }
        } catch (err: any) { setActionError(err.message); }
    };

    const saveRating = async () => {
        if (!user) { navigate("/login"); return; }
        if (!movie || !userRating) return;
        setActionError("");
        try {
            await api.saveRating({ tmdbId: movie.id, mediaType, score: userRating, review, title: movie.title || movie.name, posterPath: movie.poster_path });
            setRatingMsg("Note sauvegardée !");
            setTimeout(() => setRatingMsg(""), 2000);
        } catch (err: any) { setActionError(err.message); }
    };

    if (!movie) return <div style={{ background: "var(--bg)", minHeight: "100vh" }}><Navbar /></div>;

    const trailer = movie.videos?.results?.find((v: any) => v.type === "Trailer" && v.site === "YouTube");
    const director = movie.credits?.crew?.find((c: any) => c.job === "Director");
    const cast = movie.credits?.cast?.slice(0, isMobile ? 6 : 8) || [];
    const displayTitle = movie.title || movie.name;
    const displayYear = (movie.release_date || movie.first_air_date)?.split("-")[0];

    const contentPad = isMobile ? "5rem 1rem 3rem" : isTablet ? "6rem 2rem 3rem" : "7rem 3rem 4rem";
    const posterWidth = isMobile ? "100%" : isTablet ? 200 : 280;

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
            <Navbar />
            {/* Backdrop flou */}
            <div style={{ position: "fixed", inset: 0, backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`, backgroundSize: "cover", backgroundPosition: "center", zIndex: 0, opacity: 0.12 }} />
            <div style={{ position: "fixed", inset: 0, background: "var(--bg)", zIndex: 0, opacity: 0.88 }} />

            <div style={{ position: "relative", zIndex: 1, padding: contentPad }}>
                {/* Main : affiche + infos */}
                <div style={{ display: "flex", gap: isMobile ? "1.5rem" : "3rem", marginBottom: "3rem", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "center" : "flex-start" }}>
                    <img
                        src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
                        alt={displayTitle}
                        style={{ width: posterWidth, maxWidth: isMobile ? 200 : "none", borderRadius: 8, flexShrink: 0, boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}
                    />
                    <div style={{ flex: 1, minWidth: 0, textAlign: isMobile ? "center" : "left" }}>
                        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? "clamp(1.6rem, 6vw, 2.5rem)" : "clamp(2rem, 4vw, 3.5rem)", fontWeight: 300, marginBottom: "1rem", lineHeight: 1.1 }}>
                            {displayTitle}
                        </h1>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem", alignItems: "center", marginBottom: "1rem", justifyContent: isMobile ? "center" : "flex-start" }}>
                            <span style={{ color: "var(--gold)", fontWeight: 600, fontSize: "1rem" }}>★ {movie.vote_average?.toFixed(1)}/10</span>
                            {displayYear && <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{displayYear}</span>}
                            {movie.runtime && <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{movie.runtime} min</span>}
                            {movie.number_of_seasons && <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{movie.number_of_seasons} saison{movie.number_of_seasons > 1 ? "s" : ""}</span>}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem", justifyContent: isMobile ? "center" : "flex-start" }}>
                            {movie.genres?.map((g: any) => <span key={g.id} style={s.genre}>{g.name}</span>)}
                        </div>
                        {director && <p style={{ ...s.director, textAlign: isMobile ? "center" : "left" }}>Réalisé par <strong style={{ color: "var(--gold)" }}>{director.name}</strong></p>}
                        {!isMobile && <p style={s.overview}>{movie.overview}</p>}

                        {actionError && <p style={{ color: "#e74c3c", fontSize: "0.85rem", marginBottom: "0.75rem" }}>{actionError}</p>}

                        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap", justifyContent: isMobile ? "center" : "flex-start" }}>
                            <button
                                style={{ ...s.btn, background: inWatchlist ? "transparent" : "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: inWatchlist ? "var(--gold)" : "#0a0a0a", border: inWatchlist ? "1px solid var(--gold)" : "none", fontSize: isMobile ? "0.8rem" : "0.9rem", padding: isMobile ? "0.6rem 1.1rem" : "0.75rem 1.5rem" }}
                                onClick={toggleWatchlist}
                            >
                                {inWatchlist ? "✓ Dans ma watchlist" : "+ Watchlist"}
                            </button>
                            {trailer && (
                                <a href={`https://youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noreferrer"
                                    style={{ ...s.btnOutline, fontSize: isMobile ? "0.8rem" : "0.9rem", padding: isMobile ? "0.6rem 1.1rem" : "0.75rem 1.5rem" }}>
                                    ▶ Trailer
                                </a>
                            )}
                        </div>

                        {isMobile && <p style={{ ...s.overview, textAlign: "left" }}>{movie.overview}</p>}

                        {/* Zone notation */}
                        <div style={s.ratingBox}>
                            <p style={s.ratingLabel}>Votre note</p>
                            {!user && (
                                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
                                    <span style={{ color: "var(--gold)", cursor: "pointer" }} onClick={() => navigate("/login")}>Connectez-vous</span> pour noter.
                                </p>
                            )}
                            <div style={{ display: "flex", gap: isMobile ? "0.1rem" : "0.25rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                    <button key={n} onClick={() => setUserRating(n)} style={{ color: n <= userRating ? "var(--gold)" : "var(--border)", fontSize: isMobile ? "1.1rem" : "1.25rem", background: "none", border: "none", cursor: "pointer", padding: "0.05rem" }}>★</button>
                                ))}
                            </div>
                            <textarea style={s.textarea} placeholder="Votre avis (optionnel)..." value={review} onChange={e => setReview(e.target.value)} rows={3} />
                            <button style={s.saveBtn} onClick={saveRating} disabled={!userRating}>Sauvegarder</button>
                            {ratingMsg && <p style={{ color: "var(--gold)", fontSize: "0.85rem", marginTop: "0.5rem" }}>{ratingMsg}</p>}
                        </div>
                    </div>
                </div>

                {/* Casting */}
                {cast.length > 0 && (
                    <div>
                        <h2 style={s.sectionTitle}>Casting</h2>
                        <div style={{ display: "flex", gap: isMobile ? "0.5rem" : "1rem", flexWrap: "wrap" }}>
                            {cast.map((a: any) => (
                                <div key={a.id} style={{ width: isMobile ? 85 : 100, textAlign: "center" }}>
                                    {a.profile_path
                                        ? <img src={`https://image.tmdb.org/t/p/w185${a.profile_path}`} alt={a.name} style={{ width: isMobile ? 85 : 100, height: isMobile ? 110 : 130, objectFit: "cover", borderRadius: 4, marginBottom: "0.4rem" }} />
                                        : <div style={{ width: isMobile ? 85 : 100, height: isMobile ? 110 : 130, background: "var(--bg-3)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", color: "var(--gold)", marginBottom: "0.4rem" }}>{a.name[0]}</div>
                                    }
                                    <p style={{ fontSize: "0.7rem", color: "var(--text)", lineHeight: 1.3 }}>{a.name}</p>
                                    <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>{a.character}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    genre: { background: "rgba(201,168,76,0.1)", border: "1px solid var(--gold-dark)", color: "var(--gold)", borderRadius: 20, padding: "0.2rem 0.65rem", fontSize: "0.72rem" },
    director: { color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "0.75rem" },
    overview: { color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "1.5rem", fontSize: "0.92rem" },
    btn: { fontWeight: 600, borderRadius: 4, cursor: "pointer" },
    btnOutline: { background: "transparent", border: "1px solid var(--gold-dark)", color: "var(--gold)", fontWeight: 600, borderRadius: 4, display: "inline-block" },
    ratingBox: { background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 8, padding: "1.25rem" },
    ratingLabel: { fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.6rem", letterSpacing: "0.05em", textTransform: "uppercase" },
    textarea: { width: "100%", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: 4, padding: "0.65rem", color: "var(--text)", fontSize: "0.85rem", outline: "none", resize: "vertical", marginBottom: "0.65rem", boxSizing: "border-box" },
    saveBtn: { background: "linear-gradient(135deg, var(--gold-dark), var(--gold))", color: "#0a0a0a", fontWeight: 600, padding: "0.55rem 1.25rem", borderRadius: 4, fontSize: "0.85rem", cursor: "pointer", border: "none" },
    sectionTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.2rem, 3vw, 1.75rem)", fontWeight: 300, color: "var(--gold)", marginBottom: "1.25rem" },
};
