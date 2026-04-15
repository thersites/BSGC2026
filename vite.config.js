import { defineConfig } from "vite";

export default defineConfig({
  // Exclude @arcgis/core from Vite pre-bundling — it ships its own ESM and
  // pre-bundling breaks the SDK's internal dynamic worker imports.
  optimizeDeps: {
    exclude: ["@arcgis/core"],
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: "assets/[name]-[hash].js",
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["tests/unit/**/*.test.js"],
  },
});
