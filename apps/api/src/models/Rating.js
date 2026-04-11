import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tmdbId: { type: Number, required: true },
    mediaType: { type: String, enum: ["movie", "tv"], default: "movie" },
    score: { type: Number, min: 1, max: 10, required: true },
    review: { type: String, default: "" },
    title: String,
    posterPath: String,
}, { timestamps: true });

ratingSchema.index({ userId: 1, tmdbId: 1 }, { unique: true });

export default mongoose.model("Rating", ratingSchema);