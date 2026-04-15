// ── ArcGIS CSS (must load before the SDK initialises views) ──────────────────
import "@arcgis/core/assets/esri/themes/light/main.css";

// ── Calcite Components CSS ────────────────────────────────────────────────────
import "@esri/calcite-components/main.css";

// ── App styles ────────────────────────────────────────────────────────────────
import "./styles/main.css";

// ── Calcite custom-element registration ──────────────────────────────────────
import { defineCustomElements } from "@esri/calcite-components/loader";
defineCustomElements(window);

// ── ArcGIS asset path configuration ──────────────────────────────────────────
// In Vite dev mode, node_modules are served from the filesystem root.
// In a production build you would copy @arcgis/core/assets → dist/assets and
// change this to "/assets/".
import esriConfig from "@arcgis/core/config.js";
esriConfig.assetsPath = import.meta.env.PROD
  ? "/assets"
  : "/node_modules/@arcgis/core/assets/";

// ── App bootstrap ─────────────────────────────────────────────────────────────
import { initMap } from "./map/initMap.js";
import { initSidebar } from "./components/sidebar.js";

// Bootstrap once the DOM is ready.
document.addEventListener("DOMContentLoaded", async () => {
  // Wait for calcite-shell to upgrade so it establishes its shadow-DOM layout
  // before MapView measures the container height.
  await customElements.whenDefined("calcite-shell");

  // One rAF lets the browser apply the shell's layout paint before we hand
  // the container to ArcGIS.
  await new Promise((resolve) => requestAnimationFrame(resolve));

  const view = await initMap("map-container");
  initSidebar(view);
});
