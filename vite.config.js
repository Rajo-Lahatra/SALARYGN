// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";

export default defineConfig({
  plugins: [tsconfigPaths(), react(), tagger()],
  build: {
    outDir: "dist",              // ✅ Vercel attend "dist"
    chunkSizeWarningLimit: 2000, // (optionnel) même seuil qu'avant
  },
  server: {
    port: 4028,                  // nombre (évite la chaîne)
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: [".amazonaws.com", ".builtwithrocket.new"],
  },
});
