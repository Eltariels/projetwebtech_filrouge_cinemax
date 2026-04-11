import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import History from "../models/History.js";

export const historyRouter = Router();

historyRouter.use(authMiddleware);

// GET /api/history  — dernières 50 consultations
historyRouter.get("/", async (req, res) => {
    try {
        const items = await History.find({ userId: req.user.id })
            .sort({ visitedAt: -1 })
            .limit(50);
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/history  — enregistre une visite (upsert : met à jour visitedAt si déjà vu)
historyRouter.post("/", async (req, res) => {
    try {
        const { tmdbId, mediaType, title, posterPath } = req.body;
        await History.findOneAndUpdate(
            { userId: req.user.id, tmdbId: Number(tmdbId) },
            { userId: req.user.id, tmdbId: Number(tmdbId), mediaType, title, posterPath, visitedAt: new Date() },
            { upsert: true }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/history  — vide l'historique
historyRouter.delete("/", async (req, res) => {
    try {
        await History.deleteMany({ userId: req.user.id });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
