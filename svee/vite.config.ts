import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

const plugins = [react(), tailwindcss()];

// Vercel-kompatible Config
export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./client/src", import.meta.url)),
      "@shared": fileURLToPath(new URL("./shared", import.meta.url)),
      "@assets": fileURLToPath(new URL("./attached_assets", import.meta.url)),
    },
  },
  root: "client",
  envDir: ".",
  build: {
    outDir: "dist/public",
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    host: "127.0.0.1",
  },
});
