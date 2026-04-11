import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import User from "../models/User.js";

export const usersRouter = Router();

// GET /api/users/me
usersRouter.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/users/me
usersRouter.put("/me", authMiddleware, async (req, res) => {
    try {
        const { username, avatar } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { username, avatar },
            { new: true }
        ).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/users/preferences
usersRouter.put("/preferences", authMiddleware, async (req, res) => {
    try {
        const { decades, ambiance, rhythm, origins, genres } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { preferences: { decades, ambiance, rhythm, origins, genres } },
            { new: true }
        ).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});