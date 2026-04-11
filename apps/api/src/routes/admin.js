import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { adminMiddleware } from "../middleware/admin.js";
import User from "../models/User.js";
import Watchlist from "../models/Watchlist.js";
import Rating from "../models/Rating.js";
import History from "../models/History.js";

export const adminRouter = Router();

adminRouter.use(authMiddleware, adminMiddleware);

// GET /api/admin/stats — tableau de bord
adminRouter.get("/stats", async (req, res) => {
    try {
        const [totalUsers, totalWatchlist, totalRatings, totalHistory, recentUsers] = await Promise.all([
            User.countDocuments(),
            Watchlist.countDocuments(),
            Rating.countDocuments(),
            History.countDocuments(),
            User.find().sort({ createdAt: -1 }).limit(10).select("-password"),
        ]);
        res.json({ totalUsers, totalWatchlist, totalRatings, totalHistory, recentUsers });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/admin/users — liste tous les users
adminRouter.get("/users", async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const users = await User.find()
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .select("-password");
        const total = await User.countDocuments();
        res.json({ users, total, page: Number(page) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/admin/users/:id/role — changer le rôle
adminRouter.patch("/users/:id/role", async (req, res) => {
    try {
        const { role } = req.body;
        if (!["user", "admin"].includes(role))
            return res.status(400).json({ error: "Rôle invalide" });
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/admin/users/:id — supprimer un user et ses données
adminRouter.delete("/users/:id", async (req, res) => {
    try {
        const id = req.params.id;
        if (id === req.user.id)
            return res.status(400).json({ error: "Vous ne pouvez pas vous supprimer vous-même" });
        await Promise.all([
            User.findByIdAndDelete(id),
            Watchlist.deleteMany({ userId: id }),
            Rating.deleteMany({ userId: id }),
            History.deleteMany({ userId: id }),
        ]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
