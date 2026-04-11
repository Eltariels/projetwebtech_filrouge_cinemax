import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tmdbId: { type: Number, required: true },
    mediaType: { type: String, enum: ["movie", "tv"], default: "movie" },
    title: String,
    posterPath: String,
    backdropPath: String,
    overview: String,
    releaseDate: String,
    voteAverage: Number,
}, { timestamps: true });

watchlistSchema.index({ userId: 1, tmdbId: 1 }, { unique: true });

export default mongoose.model("Watchlist", watchlistSchema);