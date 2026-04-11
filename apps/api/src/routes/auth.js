import { Router } from "express";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import PasswordReset from "../models/PasswordReset.js";
import { sendWelcomeEmail, sendResetPasswordEmail } from "../services/email.js";

export const authRouter = Router();

const signToken = (user) =>
    jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

const handleValidation = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });
    return null;
};

// POST /api/auth/register
authRouter.post("/register",
    body("username").trim().isLength({ min: 3, max: 30 }).withMessage("Le username doit faire entre 3 et 30 caractères"),
    body("email").isEmail().normalizeEmail().withMessage("Email invalide"),
    body("password").isLength({ min: 6 }).withMessage("Le mot de passe doit faire au moins 6 caractères")
        .matches(/\d/).withMessage("Le mot de passe doit contenir au moins un chiffre"),
    async (req, res) => {
        const err = handleValidation(req, res); if (err) return;
        try {
            const { username, email, password } = req.body;
            const exists = await User.findOne({ $or: [{ email }, { username }] });
            if (exists) return res.status(409).json({ error: "Email ou username déjà utilisé" });

            const user = await User.create({ username, email, password, profiles: [{ name: username, avatar: "" }] });
            const token = signToken(user);

            // Email de bienvenue (erreur non bloquante)
            sendWelcomeEmail(email, username).catch(e => console.error("[Email] welcome:", e.message));

            res.status(201).json({ token, user: user.toSafeObject() });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

// POST /api/auth/login
authRouter.post("/login",
    body("email").isEmail().normalizeEmail().withMessage("Email invalide"),
    body("password").notEmpty().withMessage("Mot de passe requis"),
    async (req, res) => {
        const err = handleValidation(req, res); if (err) return;
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
    }
);

// POST /api/auth/forgot-password
// Envoie un email avec un lien de réinitialisation
authRouter.post("/forgot-password",
    body("email").isEmail().normalizeEmail().withMessage("Email invalide"),
    async (req, res) => {
        const err = handleValidation(req, res); if (err) return;
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });

            // On répond toujours OK pour ne pas révéler si l'email existe
            if (!user) return res.json({ message: "Si cet email existe, un lien a été envoyé." });

            // Supprime les anciens tokens pour cet utilisateur
            await PasswordReset.deleteMany({ userId: user._id });

            const rawToken = PasswordReset.generateToken();
            await PasswordReset.create({
                userId: user._id,
                token: rawToken,
                expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 heure
            });

            const resetUrl = `${process.env.APP_URL || "http://localhost:5173"}/reset-password?token=${rawToken}`;
            await sendResetPasswordEmail(email, resetUrl);

            res.json({ message: "Si cet email existe, un lien a été envoyé." });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

// POST /api/auth/reset-password
// Vérifie le token et change le mot de passe
authRouter.post("/reset-password",
    body("token").notEmpty().withMessage("Token manquant"),
    body("password").isLength({ min: 6 }).withMessage("Le mot de passe doit faire au moins 6 caractères")
        .matches(/\d/).withMessage("Le mot de passe doit contenir au moins un chiffre"),
    async (req, res) => {
        const err = handleValidation(req, res); if (err) return;
        try {
            const { token, password } = req.body;

            const reset = await PasswordReset.findOne({
                token,
                used: false,
                expiresAt: { $gt: new Date() },
            });
            if (!reset) return res.status(400).json({ error: "Lien invalide ou expiré." });

            const user = await User.findById(reset.userId);
            if (!user) return res.status(404).json({ error: "Utilisateur introuvable." });

            user.password = password;
            await user.save(); // le pre-save hook hash le mot de passe

            reset.used = true;
            await reset.save();

            res.json({ message: "Mot de passe mis à jour avec succès." });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);
