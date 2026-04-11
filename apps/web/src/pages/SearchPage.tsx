import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { api } from "../lib/api";
import { useResponsive } from "../hooks/useResponsive";

const SORT_OPTIONS = [
    { value: "popularity.desc",    label: "Popularité ↓" },
    { value: "popularity.asc",     label: "Popularité ↑" },
    { value: "vote_average.desc",  label: "Note ↓" },
    { value: "vote_average.asc",   label: "Note ↑" },
    { value: "release_date.desc",  label: "Date ↓" },
    { value: "release_date.asc",   label: "Date ↑" },
];

const GENRES = [
    { id: 28, name: "Action" }, { id: 12, name: "Aventure" }, { id: 16, name: "Animation" },
    { id: 35, name: "Comédie" }, { id: 80, name: "Crime" }, { id: 18, name: "Drame" },
    { id: 14, name: "Fantastique" }, { id: 27, name: "Horreur" }, { id: 10749, name: "Romance" },
    { id: 878, name: "Sci-Fi" }, { id: 53, name: "Thriller" }, { id: 10752, name: "Guerre" },
    { id: 36, name: "Histoire" }, { id: 99, name: "Documentaire" },
];

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { isMobile } = useResponsive();

    const q        = searchParams.get("q") || "";
    const genre    = searchParams.get("genre") || "";
    const sortBy   = searchParams.get("sort") || "popularity.desc";
    const minRating = searchParams.get("min_rating") || "";
    const page     = parseInt(searchParams.get("page") || "1", 10);

    const [results, setResults]     = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading]     = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(!isMobile);

    const updateParam = (key: string, value: string) => {
        const next = new URLSearchParams(searchParams);
        if (value) next.set(key, value); else next.delete(key);
        next.set("page", "1");
        setSearchParams(next);
    };
    const setPage = (p: number) => {
        const next = new URLSearchParams(searchParams);
        next.set("page", String(p));
        setSearchParams(next);
    };

    const fetchResults = useCallback(async () => {
        setLoading(true);
        try {
            if (q) {
                // Recherche textuelle
                const data: any = await api.search(q, String(page));
                let res = data.results?.filter((r: any) => r.poster_path) || [];
                if (genre)     res = res.filter((r: any) => r.genre_ids?.includes(Number(genre)));
                if (minRating) res = res.filter((r: any) => r.vote_average >= Number(minRating));
                if (sortBy === "vote_average.desc") res.sort((a: any, b: any) => b.vote_average - a.vote_average);
                if (sortBy === "vote_average.asc")  res.sort((a: any, b: any) => a.vote_average - b.vote_average);
                if (sortBy === "release_date.desc") res.sort((a: any, b: any) => (b.release_date || "").localeCompare(a.release_date || ""));
                if (sortBy === "release_date.asc")  res.sort((a: any, b: any) => (a.release_date || "").localeCompare(b.release_date || ""));
                setResults(res);
                setTotalPages(data.total_pages || 1);
            } else {
                // Discover avec filtres
                const params: Record<string, string> = { sort_by: sortBy, page: String(page) };
                if (genre)     params.genres = genre;
                if (minRating) params.min_rating = minRating;
                const data: any = await api.discoverFiltered(params);
                setResults(data.results?.filter((r: any) => r.poster_path) || []);
                setTotalPages(data.total_pages || 1);
            }
        } finally {
            setLoading(false);
        }
    }, [q, genre, sortBy, minRating, page]);

    useEffect(() => { fetchResults(); }, [fetchResults]);

    const filterStyle = (active: boolean): React.CSSProperties => ({
        background: active ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${active ? "var(--gold)" : "var(--border)"}`,
        color: active ? "var(--gold)" : "var(--text-muted)",
        borderRadius: 20, padding: "0.25rem 0.75rem", fontSize: "0.78rem",
        cursor: "pointer", whiteSpace: "nowrap" as const,
    });

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
            <Navbar />
            <div className="page-content large-container">
                <h1 style={s.title}>
                    {q ? <>Résultats pour <span style={{ color: "var(--gold)" }}>"{q}"</span></> : "Explorer les films"}
                </h1>

                {/* Barre filtres */}
                <div style={{ marginBottom: "1.5rem" }}>
                    {isMobile && (
                        <button onClick={() => setFiltersOpen(o => !o)} style={s.filterToggle}>
                            {filtersOpen ? "▲ Masquer les filtres" : "▼ Filtres & tri"}
                        </button>
                    )}
                    {filtersOpen && (
                        <div style={s.filterBar}>
                            {/* Tri */}
                            <div style={s.filterGroup}>
                                <span style={s.filterLabel}>Trier par</span>
                                <select
                                    value={sortBy}
                                    onChange={e => updateParam("sort", e.target.value)}
                                    style={s.select}
                                >
                                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </div>

                            {/* Note min */}
                            <div style={s.filterGroup}>
                                <span style={s.filterLabel}>Note min</span>
                                <select
                                    value={minRating}
                                    onChange={e => updateParam("min_rating", e.target.value)}
                                    style={s.select}
                                >
                                    <option value="">Toutes</option>
                                    {[5, 6, 7, 8].map(n => <option key={n} value={n}>≥ {n}/10</option>)}
                                </select>
                            </div>

                            {/* Reset */}
                            {(genre || minRating || sortBy !== "popularity.desc") && (
                                <button onClick={() => setSearchParams(q ? { q } : {})} style={s.resetBtn}>
                                    ✕ Réinitialiser
                                </button>
                            )}
                        </div>
                    )}

                    {/* Genres chips */}
                    {filtersOpen && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.75rem" }}>
                            {GENRES.map(g => (
                                <button key={g.id} style={filterStyle(genre === String(g.id))}
                                    onClick={() => updateParam("genre", genre === String(g.id) ? "" : String(g.id))}>
                                    {g.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Résultats */}
                {loading ? (
                    <p style={{ color: "var(--text-muted)" }}>Chargement...</p>
                ) : (
                    <>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: "1.25rem" }}>
                            {results.length} résultat{results.length !== 1 ? "s" : ""}
                            {totalPages > 1 && ` — page ${page}/${Math.min(totalPages, 500)}`}
                        </p>
                        <div style={s.grid}>
                            {results.map(m => <MovieCard key={m.id} movie={m} />)}
                            {!results.length && <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Aucun résultat.</p>}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div style={s.pagination}>
                                <button onClick={() => setPage(page - 1)} disabled={page <= 1} style={s.pageBtn}>← Précédent</button>
                                <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                                    {page} / {Math.min(totalPages, 500)}
                                </span>
                                <button onClick={() => setPage(page + 1)} disabled={page >= totalPages} style={s.pageBtn}>Suivant →</button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    title: { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 300, marginBottom: "1.25rem" },
    filterToggle: { background: "none", border: "1px solid var(--border)", color: "var(--gold)", padding: "0.5rem 1rem", borderRadius: 4, cursor: "pointer", fontSize: "0.85rem", marginBottom: "0.75rem" },
    filterBar: { display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "flex-end", padding: "1rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: 6, marginBottom: "0.5rem" },
    filterGroup: { display: "flex", flexDirection: "column", gap: "0.3rem" },
    filterLabel: { fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" },
    select: { background: "var(--bg-3)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: 4, padding: "0.45rem 0.75rem", fontSize: "0.85rem", outline: "none", cursor: "pointer" },
    resetBtn: { background: "none", border: "1px solid var(--red)", color: "#e74c3c", padding: "0.45rem 0.85rem", borderRadius: 4, cursor: "pointer", fontSize: "0.82rem", alignSelf: "flex-end" },
    grid: { display: "flex", flexWrap: "wrap", gap: "0.75rem" },
    pagination: { display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem", marginTop: "2.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" },
    pageBtn: { background: "rgba(201,168,76,0.1)", border: "1px solid var(--gold-dark)", color: "var(--gold)", padding: "0.6rem 1.25rem", borderRadius: 4, cursor: "pointer", fontSize: "0.875rem", transition: "opacity 0.2s" },
};
