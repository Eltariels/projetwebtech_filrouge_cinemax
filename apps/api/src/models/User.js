import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    avatar: { type: String, default: "" },
    profiles: [{
        name: { type: String, required: true },
        avatar: { type: String, default: "" },
        isKid: { type: Boolean, default: false }
    }],
    preferences: {
        decades:  { type: [String], default: [] },   // ["90s", "2000s", ...]
        ambiance: { type: [String], default: [] },   // ["dark", "feel-good", ...]
        rhythm:   { type: String,   default: "" },   // "slow" | "balanced" | "fast"
        origins:  { type: [String], default: [] },   // ["hollywood", "french", ...]
        genres:   { type: [Number], default: [] },   // IDs TMDB
    }
}, { timestamps: true });

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function (plain) {
    return bcrypt.compare(plain, this.password);
};

userSchema.methods.toSafeObject = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

export default mongoose.model("User", userSchema);