/**
 * Copies ArcGIS and Calcite static assets into public/ so Vite includes
 * them verbatim in the production build under dist/.
 *
 * ArcGIS SDK expects its assets at esriConfig.assetsPath ("/assets" in prod).
 *   source : node_modules/@arcgis/core/assets/
 *   dest   : public/assets/           → served at /assets/
 *
 * Calcite v5 (lumina) resolves assets relative to the bundle URL.
 * The main bundle lands in /assets/, so Calcite fetches from
 * /assets/components/assets/{component}/{file}.
 *   source : node_modules/@esri/calcite-components/dist/cdn/assets/
 *   dest   : public/assets/components/assets/  → served at /assets/components/assets/
 */
import { cpSync, mkdirSync } from "fs";

console.log("Copying @arcgis/core assets…");
mkdirSync("public/assets", { recursive: true });
cpSync("node_modules/@arcgis/core/assets", "public/assets", { recursive: true });

console.log("Copying @esri/calcite-components assets…");
mkdirSync("public/assets/components/assets", { recursive: true });
cpSync(
  "node_modules/@esri/calcite-components/dist/cdn/assets",
  "public/assets/components/assets",
  { recursive: true }
);

console.log("Assets ready.");
