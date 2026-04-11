import { Router } from "express";
import { tmdbFetch } from "../services/tmdb.js";

export const tmdbRouter = Router();

tmdbRouter.get("/trending", async (req, res) => {
    try {
        const { media_type = "movie", time_window = "week" } = req.query;
        const data = await tmdbFetch(`/trending/${media_type}/${time_window}`);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

tmdbRouter.get("/movies/popular", async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const data = await tmdbFetch("/movie/popular", { page });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

tmdbRouter.get("/movies/top-rated", async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const data = await tmdbFetch("/movie/top_rated", { page });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

tmdbRouter.get("/movies/:id", async (req, res) => {
    try {
        const data = await tmdbFetch(`/movie/${req.params.id}`, {
            append_to_response: "credits,videos,similar",
        });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

tmdbRouter.get("/search", async (req, res) => {
    try {
        const { q, page = 1 } = req.query;
        if (!q) return res.status(400).json({ error: "Missing query param 'q'" });
        const data = await tmdbFetch("/search/multi", { query: q, page });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/tmdb/discover?genres=28,878&sort_by=popularity.desc&min_rating=6&page=1
tmdbRouter.get("/discover", async (req, res) => {
    try {
        const { genres = "", sort_by = "popularity.desc", min_rating = "", page = 1 } = req.query;
        const { max_runtime = "" } = req.query;
        const params = { sort_by, page };
        if (genres)      params.with_genres             = genres;
        if (min_rating)  params["vote_average.gte"]     = min_rating;
        if (max_runtime) params["with_runtime.lte"]     = max_runtime;
        const data = await tmdbFetch("/discover/movie", params);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

tmdbRouter.get("/tv/:id", async (req, res) => {
    try {
        const data = await tmdbFetch(`/tv/${req.params.id}`, {
            append_to_response: "credits,videos,similar",
        });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/tmdb/movies/now-playing — films actuellement en salle
tmdbRouter.get("/movies/now-playing", async (req, res) => {
    try {
        const { page = 1, region = "FR" } = req.query;
        const data = await tmdbFetch("/movie/now_playing", { page, region });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/tmdb/person/search?q=... — recherche par acteur/réalisateur
tmdbRouter.get("/person/search", async (req, res) => {
    try {
        const { q, page = 1 } = req.query;
        if (!q) return res.status(400).json({ error: "Paramètre 'q' manquant" });
        const data = await tmdbFetch("/search/person", { query: q, page });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/tmdb/person/:id/movies — films d'un acteur/réalisateur
tmdbRouter.get("/person/:id/movies", async (req, res) => {
    try {
        const data = await tmdbFetch(`/person/${req.params.id}/combined_credits`);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

tmdbRouter.get("/genres", async (req, res) => {
    try {
        const data = await tmdbFetch("/genre/movie/list");
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});