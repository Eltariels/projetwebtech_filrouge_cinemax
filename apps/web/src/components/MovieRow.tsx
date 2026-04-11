import { useState } from "react";
import MovieCard from "./MovieCard";
import { useResponsive } from "../hooks/useResponsive";

interface Props {
    title: string;
    movies: any[];
}

export default function MovieRow({ title, movies }: Props) {
    const [startIdx, setStartIdx] = useState(0);
    const [anim, setAnim]         = useState<"left" | "right" | null>(null);
    const { isMobile, isTablet, isLarge } = useResponsive();

    if (!movies?.length) return null;

    // Nombre de cartes visibles selon la taille d'écran
    const visible = isMobile ? 2 : isTablet ? 3 : isLarge ? 7 : 5;
    const n       = movies.length;

    // Navigue dans une direction — animation 220ms puis update de l'index
    const go = (dir: "left" | "right") => {
        if (anim) return; // empêche les clics rapides pendant l'animation
        setAnim(dir);
        setTimeout(() => {
            setStartIdx(i => dir === "right" ? (i + 1) % n : (i - 1 + n) % n);
            setAnim(null);
        }, 220);
    };

    // Construit le tableau des films à afficher (boucle avec modulo)
    const displayed = Array.from(
        { length: Math.min(visible, n) },
        (_, i) => movies[(startIdx + i) % n]
    );

    return (
        <div style={{ marginBottom: "2rem" }}>
            <h2 style={s.title}>{title}</h2>
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "0.5rem" }}>

                {/* Flèche gauche */}
                <button onClick={() => go("left")} style={s.arrow} aria-label="Précédent">‹</button>

                {/* Rangée de cartes avec animation slide + fade */}
                <div style={{
                    flex: 1,
                    display: "flex",
                    gap: "0.5rem",
                    overflow: "hidden",
                    transform: anim === "right" ? "translateX(-24px)" : anim === "left" ? "translateX(24px)" : "translateX(0)",
                    opacity: anim ? 0.55 : 1,
                    transition: "transform 0.22s ease, opacity 0.22s ease",
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

                {/* Flèche droite */}
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
