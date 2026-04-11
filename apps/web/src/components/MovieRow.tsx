import { useState, useRef } from "react";
import MovieCard from "./MovieCard";
import { useResponsive } from "../hooks/useResponsive";

interface Props {
    title: string;
    movies: any[];
}

export default function MovieRow({ title, movies }: Props) {
    const [startIdx, setStartIdx] = useState(0);
    const [fading,   setFading]   = useState(false);
    const cooldown = useRef(false);
    const { isMobile, isTablet, isLarge } = useResponsive();

    if (!movies?.length) return null;

    const visible = isMobile ? 2 : isTablet ? 3 : isLarge ? 7 : 5;
    const n       = movies.length;

    const go = (dir: "left" | "right") => {
        if (cooldown.current) return;
        cooldown.current = true;

        // Phase 1 : fade out (150ms)
        setFading(true);

        setTimeout(() => {
            // Phase 2 : change les cartes pendant qu'elles sont invisibles
            setStartIdx(i => dir === "right" ? (i + 1) % n : (i - 1 + n) % n);
            setFading(false);          // fade in

            // Cooldown léger pour éviter les clics trop rapides
            setTimeout(() => { cooldown.current = false; }, 100);
        }, 150);
    };

    const displayed = Array.from(
        { length: Math.min(visible, n) },
        (_, i) => movies[(startIdx + i) % n]
    );

    return (
        <div style={{ marginBottom: "2rem" }}>
            <h2 style={s.title}>{title}</h2>
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "0.5rem" }}>

                <button onClick={() => go("left")} style={s.arrow} aria-label="Précédent">‹</button>

                <div style={{
                    flex: 1,
                    display: "flex",
                    gap: "0.5rem",
                    overflow: "hidden",
                    opacity: fading ? 0 : 1,
                    transition: "opacity 0.15s ease",
                }}>
                    {displayed.map((m, i) => (
                        <div
                            key={`${m.id}-${startIdx}-${i}`}
                            style={{ flex: `0 0 calc(${100 / displayed.length}% - 0.5rem)` }}
                        >
                            <MovieCard movie={m} />
                        </div>
                    ))}
                </div>

                <button onClick={() => go("right")} style={s.arrow} aria-label="Suivant">›</button>
            </div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    title: {
        color: "var(--gold)",
        marginBottom: "0.75rem",
        fontSize: "1.1rem",
        fontWeight: 400,
        letterSpacing: "0.04em",
        fontFamily: "'Cormorant Garamond', serif",
    },
    arrow: {
        background: "rgba(201,168,76,0.08)",
        border: "1px solid rgba(201,168,76,0.25)",
        color: "var(--gold)",
        fontSize: "1.8rem",
        width: "2.25rem",
        height: "2.25rem",
        borderRadius: "50%",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "background 0.2s, border-color 0.2s",
        lineHeight: 1,
        paddingBottom: "2px",
    },
};
