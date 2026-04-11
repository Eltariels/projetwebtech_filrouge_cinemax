import User from "../models/User.js";

export async function adminMiddleware(req, res, next) {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== "admin") {
            return res.status(403).json({ error: "Accès réservé aux administrateurs" });
        }
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
