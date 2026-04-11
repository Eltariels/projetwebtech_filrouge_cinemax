import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import Rating from "../models/Rating.js";

export const ratingsRouter = Router();

ratingsRouter.use(authMiddleware);

// GET /api/ratings
ratingsRouter.get("/", async (req, res) => {
    try {
        const items = await Rating.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/ratings/:tmdbId
ratingsRouter.get("/:tmdbId", async (req, res) => {
    try {
        const rating = await Rating.findOne({ userId: req.user.id, tmdbId: Number(req.params.tmdbId) });
        res.json(rating || null);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/ratings
ratingsRouter.post("/", async (req, res) => {
    try {
        const { tmdbId } = req.body;
        const existing = await Rating.findOne({ userId: req.user.id, tmdbId });
        if (existing) {
            const updated = await Rating.findByIdAndUpdate(existing._id, req.body, { new: true });
            return res.json(updated);
        }
        const rating = await Rating.create({ userId: req.user.id, ...req.body });
        res.status(201).json(rating);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/ratings/:tmdbId
ratingsRouter.delete("/:tmdbId", async (req, res) => {
    try {
        await Rating.findOneAndDelete({ userId: req.user.id, tmdbId: Number(req.params.tmdbId) });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});