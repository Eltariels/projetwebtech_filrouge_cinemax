import mongoose from "mongoose";

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("🗄️  MongoDB connecté");
    } catch (err) {
        console.error("❌ MongoDB erreur:", err.message);
        process.exit(1);
    }
}