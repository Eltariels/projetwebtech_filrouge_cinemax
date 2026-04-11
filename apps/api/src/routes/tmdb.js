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

// GET /api/tmdb/discover?genres=28,878&page=1
tmdbRouter.get("/discover", async (req, res) => {
    try {
        const { genres = "", page = 1 } = req.query;
        const data = await tmdbFetch("/discover/movie", {
            with_genres: genres,
            sort_by: "popularity.desc",
            page,
        });
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

tmdbRouter.get("/genres", async (req, res) => {
    try {
        const data = await tmdbFetch("/genre/movie/list");
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});