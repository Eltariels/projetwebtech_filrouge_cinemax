import { useRef } from "react";
import MovieCard from "./MovieCard";
import { useResponsive } from "../hooks/useResponsive";

interface Props {
    title: string;
    movies: any[];
}

export default function MovieRow({ title, movies }: Props) {
    const rowRef = useRef<HTMLDivElement>(null);
    const { isMobile } = useResponsive();

    const scroll = (dir: "left" | "right") => {
        if (rowRef.current) {
            rowRef.current.scrollBy({ left: dir === "right" ? 500 : -500, behavior: "smooth" });
        }
    };

    if (!movies?.length) return null;

    return (
        <div style={s.section}>
            <h2 style={s.title}>{title}</h2>
            <div style={s.wrapper}>
                {!isMobile && (
                    <button style={{ ...s.arrow, left: 0 }} onClick={() => scroll("left")}>‹</button>
                )}
                <div ref={rowRef} style={s.row}>
                    {movies.map(m => <MovieCard key={m.id} movie={m} />)}
                </div>
                {!isMobile && (
                    <button style={{ ...s.arrow, right: 0 }} onClick={() => scroll("right")}>›</button>
                )}
            </div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    section: { marginBottom: "2.5rem" },
    title: { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", fontWeight: 400, color: "var(--gold)", marginBottom: "0.85rem", letterSpacing: "0.05em" },
    wrapper: { position: "relative" },
    row: { display: "flex", gap: "0.65rem", overflowX: "auto", scrollbarWidth: "none", paddingBottom: "0.5rem", paddingLeft: "0.1rem", paddingRight: "0.1rem" },
    arrow: { position: "absolute", top: "40%", transform: "translateY(-50%)", zIndex: 10, background: "rgba(10,10,10,0.92)", border: "1px solid var(--gold-dark)", color: "var(--gold)", width: 34, height: 56, fontSize: "1.4rem", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
};
