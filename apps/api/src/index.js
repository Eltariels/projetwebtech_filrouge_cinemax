import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import { tmdbRouter } from "./routes/tmdb.js";
import { authRouter } from "./routes/auth.js";
import { usersRouter } from "./routes/users.js";
import { watchlistRouter } from "./routes/watchlist.js";
import { ratingsRouter } from "./routes/ratings.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/tmdb", tmdbRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/watchlist", watchlistRouter);
app.use("/api/ratings", ratingsRouter);

app.use((req, res) => res.status(404).json({ error: "Route not found" }));

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 API running on http://localhost:${PORT}`);
        console.log(`🔑 TMDB token: ${process.env.TMDB_API_READ_ACCESS_TOKEN ? "✅" : "❌"}`);
    });
});