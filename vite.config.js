import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./": i percorsi sono relativi, quindi il sito funziona su GitHub Pages
// con qualsiasi nome di repository (es. utente.github.io/portfolio/).
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 800,
  },
});
