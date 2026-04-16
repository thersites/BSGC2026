import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  // Exclude @arcgis/core from Vite pre-bundling — it ships its own ESM and
  // pre-bundling breaks the SDK's internal dynamic worker imports.
  optimizeDeps: {
    exclude: ["@arcgis/core"],
  },
  plugins: [
    // Copy ArcGIS SDK assets (workers, fonts, sprites) into dist/assets so
    // esriConfig.assetsPath = "/assets" resolves correctly in production.
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/@arcgis/core/assets",
          dest: ".",
        },
      ],
    }),
  ],
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
