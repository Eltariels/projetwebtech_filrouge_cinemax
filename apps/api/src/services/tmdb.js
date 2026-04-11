const TMDB_BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const TMDB_TOKEN = process.env.TMDB_API_READ_ACCESS_TOKEN;

// TMDB supporte deux méthodes d'auth :
// - Bearer token (JWT Read Access Token, commence par "eyJ")
// - api_key en query param (clé courte 32 hex)
const isJWT = (t) => typeof t === "string" && t.startsWith("eyJ");

export async function tmdbFetch(endpoint, params = {}) {
    if (!TMDB_TOKEN) throw new Error("TMDB_API_READ_ACCESS_TOKEN is not set");

    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.set("language", "fr-FR");

    if (!isJWT(TMDB_TOKEN)) {
        url.searchParams.set("api_key", TMDB_TOKEN);
    }

    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
    }

    const headers = { "Content-Type": "application/json" };
    if (isJWT(TMDB_TOKEN)) {
        headers["Authorization"] = `Bearer ${TMDB_TOKEN}`;
    }

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.status_message || `TMDB error ${response.status}`);
    }

    return response.json();
}