import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Optional: Nur lokal verwenden
let localPlugins: any[] = [];
if (process.env.NODE_ENV !== "production") {
  try {
    const { jsxLocPlugin } = await import("@builder.io/vite-plugin-jsx-loc");
    const { vitePluginManusRuntime } = await import("vite-plugin-manus-runtime");
    localPlugins.push(jsxLocPlugin(), vitePluginManusRuntime());

    // Manus Debug Collector lokal aktivieren
    const fs = await import("node:fs");
    const path = await import("node:path");

    function vitePluginManusDebugCollector() {
      return {
        name: "manus-debug-collector",
        configureServer(server: any) {
          const LOG_DIR = path.join(process.cwd(), ".manus-logs");
          if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
          // Weitere Log-Handler nur lokal...
        },
      };
    }

    localPlugins.push(vitePluginManusDebugCollector());
  } catch (e) {
    console.warn("Lokale Dev-Plugins konnten nicht geladen werden:", e);
  }
}

// Haupt-Plugins: React + Tailwind
const plugins = [react(), tailwindcss(), ...localPlugins];

// Vercel-kompatible Config
export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": "/src",
      "@shared": "/shared",
      "@assets": "/attached_assets",
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
    host: true,
  },
});
