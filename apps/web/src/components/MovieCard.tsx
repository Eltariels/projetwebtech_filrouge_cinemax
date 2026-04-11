import { useState } from "react";
import { Link } from "react-router-dom";

interface Movie {
    id: number;
    title?: string;
    name?: string;
    poster_path: string;
    vote_average: number;
    release_date?: string;
    media_type?: string;
}

export default function MovieCard({ movie }: { movie: Movie }) {
    const [hovered, setHovered] = useState(false);
    const title = movie.title || movie.name || "Inconnu";
    const year = movie.release_date?.split("-")[0] || "";
    const score = movie.vote_average?.toFixed(1);
    const type = movie.media_type === "tv" ? "tv" : "movie";

    return (
        <Link
            to={`/movie/${movie.id}?type=${type}`}
            className="movie-card-w"
            style={s.card}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={s.imageWrapper}>
                {movie.poster_path ? (
                    <img
                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                        alt={title}
                        style={{ ...s.img, transform: hovered ? "scale(1.05)" : "scale(1)" }}
                    />
                ) : (
                    <div style={s.noImg}>{title[0]}</div>
                )}
                <div style={{ ...s.overlay, opacity: hovered ? 1 : 0 }}>
                    <span style={s.score}>★ {score}</span>
                </div>
            </div>
            <div style={s.info}>
                <p style={s.title}>{title}</p>
                {year && <p style={s.year}>{year}</p>}
            </div>
        </Link>
    );
}

const s: Record<string, React.CSSProperties> = {
    card: { display: "block", flexShrink: 0, cursor: "pointer", transition: "transform 0.2s" },
    imageWrapper: { position: "relative", borderRadius: 4, overflow: "hidden", aspectRatio: "2/3", background: "var(--bg-3)" },
    img: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" },
    noImg: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", color: "var(--gold)" },
    overlay: { position: "absolute", bottom: 0, left: 0, right: 0, padding: "1rem 0.5rem 0.5rem", background: "linear-gradient(transparent, rgba(0,0,0,0.85))", transition: "opacity 0.2s" },
    score: { color: "var(--gold)", fontSize: "0.8rem", fontWeight: 600 },
    info: { padding: "0.5rem 0" },
    title: { fontSize: "0.78rem", color: "var(--text)", lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" },
    year: { fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.2rem" },
};
