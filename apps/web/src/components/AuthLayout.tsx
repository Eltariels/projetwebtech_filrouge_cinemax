import { useEffect, useState, ReactNode } from "react";
import { api } from "../lib/api";
import { useResponsive } from "../hooks/useResponsive";

function WaveBackground() {
    return (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>

            {/* Orbes lumineux flottants */}
            <div style={{
                position: "absolute", top: "12%", right: "8%",
                width: 300, height: 300, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(201,168,76,0.09) 0%, transparent 68%)",
                animation: "orbFloat 11s ease-in-out infinite",
            }} />
            <div style={{
                position: "absolute", bottom: "8%", left: "-8%",
                width: 220, height: 220, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(232,201,126,0.06) 0%, transparent 70%)",
                animation: "orbFloat 15s ease-in-out infinite reverse",
            }} />
            <div style={{
                position: "absolute", top: "50%", left: "20%",
                width: 160, height: 160, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)",
                animation: "orbFloat 9s ease-in-out infinite 3s",
            }} />

            {/* Vague 1 — grande, très floutée, lente (fond atmosphérique) */}
            <svg style={{
                position: "absolute", bottom: "32%", left: 0,
                width: "200%", height: 180,
                opacity: 0.08, filter: "blur(16px)",
                animation: "waveSlide 22s linear infinite",
            }} viewBox="0 0 2880 180" preserveAspectRatio="none">
                <path d="M0,90 C240,20 480,160 720,90 C960,20 1200,160 1440,90 C1680,20 1920,160 2160,90 C2400,20 2640,160 2880,90 L2880,180 L0,180 Z" fill="#c9a84c" />
            </svg>

            {/* Vague 2 — moyenne, floue, inversée */}
            <svg style={{
                position: "absolute", bottom: "42%", left: 0,
                width: "200%", height: 120,
                opacity: 0.06, filter: "blur(8px)",
                animation: "waveSlide 15s linear infinite reverse",
            }} viewBox="0 0 2880 120" preserveAspectRatio="none">
                <path d="M0,60 C180,12 360,108 540,60 C720,12 900,108 1080,60 C1260,12 1440,108 1620,60 C1800,12 1980,108 2160,60 C2340,12 2520,108 2700,60 C2880,12 2880,60 2880,60 L2880,120 L0,120 Z" fill="#e8c97e" />
            </svg>

            {/* Vague 3 — trait net, principal (la "vaguelette" précise) */}
            <svg style={{
                position: "absolute", bottom: "34%", left: 0,
                width: "200%", height: 90,
                opacity: 0.4,
                animation: "waveSlide 18s linear infinite",
            }} viewBox="0 0 2880 90" preserveAspectRatio="none">
                <path d="M0,45 C180,9 360,81 540,45 C720,9 900,81 1080,45 C1260,9 1440,81 1620,45 C1800,9 1980,81 2160,45 C2340,9 2520,81 2700,45 C2880,9 2880,45 2880,45"
                    fill="none" stroke="rgba(201,168,76,0.75)" strokeWidth="1.2" />
            </svg>

            {/* Vague 4 — trait fin, léger, plus haute */}
            <svg style={{
                position: "absolute", bottom: "44%", left: 0,
                width: "200%", height: 70,
                opacity: 0.22,
                animation: "waveSlide 12s linear infinite reverse",
            }} viewBox="0 0 2880 70" preserveAspectRatio="none">
                <path d="M0,35 C120,7 240,63 360,35 C480,7 600,63 720,35 C840,7 960,63 1080,35 C1200,7 1320,63 1440,35 C1560,7 1680,63 1800,35 C1920,7 2040,63 2160,35 C2280,7 2400,63 2520,35 C2640,7 2760,63 2880,35"
                    fill="none" stroke="rgba(232,201,126,0.55)" strokeWidth="0.8" />
            </svg>

            {/* Vague 5 — minuscule, basse, rapide */}
            <svg style={{
                position: "absolute", bottom: "18%", left: 0,
                width: "200%", height: 50,
                opacity: 0.14,
                animation: "waveSlide 9s linear infinite",
            }} viewBox="0 0 2880 50" preserveAspectRatio="none">
                <path d="M0,25 C90,5 180,45 270,25 C360,5 450,45 540,25 C630,5 720,45 810,25 C900,5 990,45 1080,25 C1170,5 1260,45 1350,25 C1440,5 1530,45 1620,25 C1710,5 1800,45 1890,25 C1980,5 2070,45 2160,25 C2250,5 2340,45 2430,25 C2520,5 2610,45 2700,25 C2790,5 2880,25 2880,25"
                    fill="none" stroke="rgba(201,168,76,0.45)" strokeWidth="0.7" />
            </svg>

            {/* Vague 6 — haut du panel, très discrète */}
            <svg style={{
                position: "absolute", top: "10%", left: 0,
                width: "200%", height: 60,
                opacity: 0.1,
                animation: "waveSlide 25s linear infinite reverse",
            }} viewBox="0 0 2880 60" preserveAspectRatio="none">
                <path d="M0,30 C240,6 480,54 720,30 C960,6 1200,54 1440,30 C1680,6 1920,54 2160,30 C2400,6 2640,54 2880,30"
                    fill="none" stroke="rgba(201,168,76,0.5)" strokeWidth="0.9" />
            </svg>

            {/* Lueur centrale dorée subtile (halo derrière le form) */}
            <div style={{
                position: "absolute", top: "35%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: "120%", height: "50%",
                background: "radial-gradient(ellipse, rgba(201,168,76,0.04) 0%, transparent 65%)",
                pointerEvents: "none",
            }} />
        </div>
    );
}

interface Props {
    children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
    const { isMobile, isTablet } = useResponsive();
    const [movie, setMovie] = useState<any>(null);

    useEffect(() => {
        (api.getTrending() as Promise<any>)
            .then(d => {
                const results = d.results?.filter((m: any) => m.backdrop_path) || [];
                if (results.length) {
                    // Film aléatoire parmi les 10 premiers tendances
                    setMovie(results[Math.floor(Math.random() * Math.min(10, results.length))]);
                }
            })
            .catch(() => {});
    }, []);

    const showSplit = !isMobile && !isTablet;

    return (
        <div style={{ minHeight: "100vh", display: "flex", background: "#0a0a0a" }}>

            {/* ── Côté gauche : backdrop animé ──────────────────────────── */}
            {showSplit && (
                <div style={{
                    flex: "0 0 55%",
                    position: "relative",
                    overflow: "hidden",
                }}>
                    {/* Image Ken Burns */}
                    {movie?.backdrop_path && (
                        <div style={{
                            position: "absolute", inset: "-5%",
                            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            animation: "kenBurns 18s ease-in-out infinite",
                        }} />
                    )}

                    {/* Overlay gradient animé */}
                    <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(to right, rgba(10,10,10,0.15) 0%, rgba(10,10,10,0.4) 60%, rgba(10,10,10,0.92) 100%), linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 50%)",
                        animation: "gradientShift 6s ease-in-out infinite",
                    }} />

                    {/* Infos du film en bas à gauche */}
                    {movie && (
                        <div style={{
                            position: "absolute", bottom: "2.5rem", left: "2.5rem", right: "3rem",
                        }}>
                            <p style={{ color: "var(--gold)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "0.5rem", fontWeight: 500 }}>
                                ✦ Film à la une
                            </p>
                            <h2 style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
                                fontWeight: 300,
                                color: "#f0ede8",
                                lineHeight: 1.15,
                                marginBottom: "0.6rem",
                                textShadow: "0 2px 12px rgba(0,0,0,0.6)",
                            }}>
                                {movie.title || movie.name}
                            </h2>
                            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                                <span style={{ color: "var(--gold)", fontSize: "0.85rem", fontWeight: 600 }}>
                                    ★ {movie.vote_average?.toFixed(1)}
                                </span>
                                {(movie.release_date || movie.first_air_date) && (
                                    <span style={{ color: "rgba(240,237,232,0.55)", fontSize: "0.8rem" }}>
                                        {(movie.release_date || movie.first_air_date).split("-")[0]}
                                    </span>
                                )}
                            </div>
                            {movie.overview && (
                                <p style={{
                                    color: "rgba(240,237,232,0.5)",
                                    fontSize: "0.8rem",
                                    lineHeight: 1.6,
                                    marginTop: "0.6rem",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    textShadow: "0 1px 6px rgba(0,0,0,0.5)",
                                }}>
                                    {movie.overview}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ── Côté droit : formulaire ────────────────────────────────── */}
            <div style={{
                flex: showSplit ? "0 0 45%" : "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: isMobile ? "2rem 1.25rem" : "2rem",
                position: "relative",
                background: showSplit ? "rgba(8,8,8,0.98)" : "#0a0a0a",
            }}>
                {/* Vagues animées dorées */}
                <WaveBackground />

                {/* Fond dégradé sur mobile */}
                {!showSplit && (
                    <div style={{
                        position: "fixed", inset: 0, zIndex: -1,
                        background: "linear-gradient(135deg, #0a0a0a 0%, #120e05 50%, #0a0a0a 100%)",
                    }} />
                )}

                {/* Séparateur vertical subtil */}
                {showSplit && (
                    <div style={{
                        position: "absolute", left: 0, top: "10%", bottom: "10%", width: 1,
                        background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.15), transparent)",
                    }} />
                )}

                <div style={{ width: "100%", maxWidth: 400, position: "relative", zIndex: 1 }}>
                    {children}
                </div>
            </div>
        </div>
    );
}
