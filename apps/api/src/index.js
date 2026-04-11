import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { connectDB } from "./db.js";
import { tmdbRouter }     from "./routes/tmdb.js";
import { authRouter }     from "./routes/auth.js";
import { usersRouter }    from "./routes/users.js";
import { watchlistRouter }from "./routes/watchlist.js";
import { ratingsRouter }  from "./routes/ratings.js";
import { historyRouter }  from "./routes/history.js";
import { adminRouter }    from "./routes/admin.js";

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ── Rate limiting ─────────────────────────────────────────────────────────────
// Limite globale : 300 req / 15 min par IP (protection DDoS de base)
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Trop de requêtes. Réessaie dans quelques minutes." },
}));

// Limite stricte sur les routes d'auth : 20 req / 15 min (brute-force protection)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: "Trop de tentatives. Réessaie dans 15 minutes." },
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/tmdb",      tmdbRouter);
app.use("/api/auth",      authLimiter, authRouter);
app.use("/api/users",     usersRouter);
app.use("/api/watchlist", watchlistRouter);
app.use("/api/ratings",   ratingsRouter);
app.use("/api/history",   historyRouter);
app.use("/api/admin",     adminRouter);

app.use((req, res) => res.status(404).json({ error: "Route not found" }));

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 API running on http://localhost:${PORT}`);
        console.log(`🔑 TMDB token: ${process.env.TMDB_API_READ_ACCESS_TOKEN ? "✅" : "❌"}`);
        console.log(`📧 Email SMTP: ${process.env.SMTP_HOST ? "✅" : "⚠️  non configuré (mode log)"}`);
    });
});
