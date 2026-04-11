import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import Watchlist from "../models/Watchlist.js";

export const watchlistRouter = Router();

watchlistRouter.use(authMiddleware);

// GET /api/watchlist
watchlistRouter.get("/", async (req, res) => {
    try {
        const items = await Watchlist.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/watchlist
watchlistRouter.post("/", async (req, res) => {
    try {
        const item = await Watchlist.create({ userId: req.user.id, ...req.body });
        res.status(201).json(item);
    } catch (err) {
        if (err.code === 11000) return res.status(409).json({ error: "Déjà dans la watchlist" });
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/watchlist/:tmdbId
watchlistRouter.delete("/:tmdbId", async (req, res) => {
    try {
        await Watchlist.findOneAndDelete({ userId: req.user.id, tmdbId: Number(req.params.tmdbId) });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});