import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
    userId:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tmdbId:     { type: Number, required: true },
    mediaType:  { type: String, enum: ["movie", "tv"], default: "movie" },
    title:      String,
    posterPath: String,
    visitedAt:  { type: Date, default: Date.now },
}, { timestamps: false });

// Index pour éviter les doublons et retrouver facilement
historySchema.index({ userId: 1, visitedAt: -1 });

export default mongoose.model("History", historySchema);
