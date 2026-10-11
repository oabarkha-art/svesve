import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./client/src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: [
      "shared/**/*.test.ts",
      "netlify/**/*.test.ts",
      "client/src/contexts/**/*.test.ts",
      "client/src/**/*.test.tsx",
    ],
  },
});
