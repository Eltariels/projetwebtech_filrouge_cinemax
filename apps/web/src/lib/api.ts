const API_BASE = "/api/tmdb";

async function apiFetch<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(endpoint, window.location.origin);
    if (params) {
        for (const [key, value] of Object.entries(params)) {
            url.searchParams.set(key, value);
        }
    }
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return res.json();
}

async function authFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem("token");
    const res = await fetch(endpoint, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as any).error || `Erreur ${res.status}`);
    }
    return res.json();
}

export const api = {
    // TMDB
    getTrending: (mediaType = "movie", timeWindow = "week") =>
        apiFetch(`${API_BASE}/trending`, { media_type: mediaType, time_window: timeWindow }),
    getPopularMovies: (page = "1") => apiFetch(`${API_BASE}/movies/popular`, { page }),
    getTopRated: (page = "1") => apiFetch(`${API_BASE}/movies/top-rated`, { page }),
    discover: (genres: number[], page = "1") =>
        apiFetch(`${API_BASE}/discover`, { genres: genres.join(","), page }),
    discoverFiltered: (params: Record<string, string>) =>
        apiFetch(`${API_BASE}/discover`, params),
    getMovie: (id: number | string) => apiFetch(`${API_BASE}/movies/${id}`),
    getTv: (id: number | string) => apiFetch(`${API_BASE}/tv/${id}`),
    search: (query: string, page = "1") => apiFetch(`${API_BASE}/search`, { q: query, page }),
    getGenres: () => apiFetch(`${API_BASE}/genres`),

    // Watchlist
    getWatchlist: () => authFetch("/api/watchlist"),
    addToWatchlist: (data: object) => authFetch("/api/watchlist", { method: "POST", body: JSON.stringify(data) }),
    removeFromWatchlist: (tmdbId: number) => authFetch(`/api/watchlist/${tmdbId}`, { method: "DELETE" }),

    // Préférences
    savePreferences: (data: object) => authFetch("/api/users/preferences", { method: "PUT", body: JSON.stringify(data) }),

    // Historique
    getHistory: () => authFetch("/api/history"),
    addToHistory: (data: object) => authFetch("/api/history", { method: "POST", body: JSON.stringify(data) }),
    clearHistory: () => authFetch("/api/history", { method: "DELETE" }),

    // Ratings
    getRatings: () => authFetch("/api/ratings"),
    getRating: (tmdbId: number) => authFetch(`/api/ratings/${tmdbId}`),
    saveRating: (data: object) => authFetch("/api/ratings", { method: "POST", body: JSON.stringify(data) }),
    deleteRating: (tmdbId: number) => authFetch(`/api/ratings/${tmdbId}`, { method: "DELETE" }),
};