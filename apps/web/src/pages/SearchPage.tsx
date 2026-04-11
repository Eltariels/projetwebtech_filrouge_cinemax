import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { api } from "../lib/api";

export default function SearchPage() {
    const [params] = useSearchParams();
    const q = params.get("q") || "";
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!q) return;
        setLoading(true);
        (api.search(q) as Promise<any>)
            .then(d => setResults(d.results?.filter((r: any) => r.poster_path) || []))
            .finally(() => setLoading(false));
    }, [q]);

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
            <Navbar />
            <div className="page-content large-container">
                <h1 style={s.title}>
                    Résultats pour <span style={{ color: "var(--gold)" }}>"{q}"</span>
                </h1>
                {loading ? (
                    <p style={{ color: "var(--text-muted)" }}>Recherche en cours...</p>
                ) : (
                    <>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                            {results.length} résultat{results.length !== 1 ? "s" : ""}
                        </p>
                        <div style={s.grid}>
                            {results.map(m => <MovieCard key={m.id} movie={m} />)}
                            {!results.length && <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Aucun résultat trouvé.</p>}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    title: { fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 300, marginBottom: "0.5rem" },
    grid: { display: "flex", flexWrap: "wrap", gap: "0.75rem" },
};
