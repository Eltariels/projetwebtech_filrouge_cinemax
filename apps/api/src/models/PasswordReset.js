import { Schema, model } from "mongoose";
import crypto from "crypto";

const passwordResetSchema = new Schema({
    userId:    { type: Schema.Types.ObjectId, ref: "User", required: true },
    token:     { type: String, required: true },
    expiresAt: { type: Date, required: true },
    used:      { type: Boolean, default: false },
});

// TTL index : MongoDB supprime automatiquement le document quand expiresAt est dépassé
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Génère un token sécurisé aléatoire (hex 40 chars)
passwordResetSchema.statics.generateToken = () => crypto.randomBytes(20).toString("hex");

export default model("PasswordReset", passwordResetSchema);
