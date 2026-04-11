/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// __dirname n'existe pas en ESM — on le recrée depuis import.meta.url
// import.meta.url = "file:///C:/projet-netflix-webtech/apps/web/vite.config.ts"
// dirname(...)    = "C:/projet-netflix-webtech/apps/web"
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    // root = dossier qui contient index.html
    // Sans ça, vite build cherche index.html à la racine du projet
    root: __dirname,
    plugins: [react()],
    test: {
        globals: true,
        environment: "jsdom",
        // resolve() construit un chemin absolu → pas de confusion peu importe
        // depuis où on lance la commande
        setupFiles: [resolve(__dirname, "./src/test/setup.ts")],
    },
    server: {
        port: 5173,
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                changeOrigin: true,
            },
        },
    },
});
