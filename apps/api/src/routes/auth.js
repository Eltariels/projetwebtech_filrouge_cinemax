import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authRouter = Router();

const signToken = (user) =>
    jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/register
authRouter.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password)
            return res.status(400).json({ error: "Tous les champs sont requis" });

        const exists = await User.findOne({ $or: [{ email }, { username }] });
        if (exists)
            return res.status(409).json({ error: "Email ou username déjà utilisé" });

        const user = await User.create({
            username, email, password,
            profiles: [{ name: username, avatar: "" }]
        });

        const token = signToken(user);
        res.status(201).json({ token, user: user.toSafeObject() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/auth/login
authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password)))
            return res.status(401).json({ error: "Email ou mot de passe incorrect" });

        const token = signToken(user);
        res.json({ token, user: user.toSafeObject() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});