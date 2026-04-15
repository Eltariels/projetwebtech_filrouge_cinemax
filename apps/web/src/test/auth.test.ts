import { describe, it, expect, beforeEach } from "vitest";

// Simule localStorage
// On utilise globalThis (standard ECMAScript) plutôt que global (Node.js only)
const storage: Record<string, string> = {};
Object.defineProperty(globalThis, "localStorage", {
    value: {
        getItem:    (k: string) => storage[k] ?? null,
        setItem:    (k: string, v: string) => { storage[k] = v; },
        removeItem: (k: string) => { delete storage[k]; },
        clear:      () => Object.keys(storage).forEach(k => delete storage[k]),
        length: 0,
        key: () => null,
    },
    writable: true,
});

describe("Auth — gestion du token JWT", () => {
    beforeEach(() => localStorage.clear());

    it("stocke le token après login", () => {
        localStorage.setItem("token", "eyJfake.token.123");
        expect(localStorage.getItem("token")).toBe("eyJfake.token.123");
    });

    it("retourne null si pas de token", () => {
        expect(localStorage.getItem("token")).toBeNull();
    });

    it("supprime le token au logout", () => {
        localStorage.setItem("token", "eyJfake.token.123");
        localStorage.removeItem("token");
        expect(localStorage.getItem("token")).toBeNull();
    });
});

describe("Auth — validation des champs (règles express-validator)", () => {
    it("email invalide détecté", () => {
        const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        expect(isValidEmail("pas-un-email")).toBe(false);
        expect(isValidEmail("theo@gmail.com")).toBe(true);
    });

    it("mot de passe trop court refusé", () => {
        const isValidPassword = (p: string) => p.length >= 6 && /\d/.test(p);
        expect(isValidPassword("abc")).toBe(false);
        expect(isValidPassword("abc123")).toBe(true);
    });

    it("username trop court refusé", () => {
        const isValidUsername = (u: string) => u.trim().length >= 3;
        expect(isValidUsername("ab")).toBe(false);
        expect(isValidUsername("theo")).toBe(true);
    });
});
