import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    // globals: true,
    setupFiles: "__test__/setup.ts",
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
