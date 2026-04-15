import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import Graphic from "@arcgis/core/Graphic.js";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol.js";
import { createCountriesLayer } from "./layers.js";
import { highlightSymbol } from "./renderer.js";
import { store } from "../state/store.js";
import { getScoreColor } from "../data/aiPresence.js";

/** Tooltip DOM element. */
const tooltip = document.getElementById("tooltip");

/** Layer for transient hover highlight (blue). */
const highlightLayer = new GraphicsLayer({ id: "highlight", listMode: "hide" });

/** Layer for persistent selection highlight. Sits above the hover layer. */
const selectionLayer = new GraphicsLayer({ id: "selection", listMode: "hide" });

/**
 * Build a fill symbol whose color matches the legend class for the given score.
 * @param {number|null} score
 */
function buildSelectionSymbol(score) {
  const hex = getScoreColor(score);
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return new SimpleFillSymbol({
    color: [r, g, b, 0.35],
    outline: { color: [r, g, b, 1], width: 2.5 },
  });
}

/** Currently active hover graphic. */
let hoverGraphic = null;

/**
 * Shows the tooltip near the cursor.
 * @param {string} text
 * @param {number} x  screen X
 * @param {number} y  screen Y
 */
function showTooltip(text, x, y) {
  tooltip.textContent = text;
  tooltip.style.left = `${x + 14}px`;
  tooltip.style.top  = `${y - 8}px`;
  tooltip.hidden = false;
  tooltip.setAttribute("aria-hidden", "false");
}

function hideTooltip() {
  tooltip.hidden = true;
  tooltip.setAttribute("aria-hidden", "true");
}

/**
 * Initialises and returns the MapView.
 * @param {string} containerId  ID of the DOM element to render into
 * @returns {Promise<import("@arcgis/core/views/MapView").default>}
 */
export async function initMap(containerId) {
  const countriesLayer = await createCountriesLayer();

  const map = new Map({
    // "osm" basemap uses OpenStreetMap tiles and needs no API key.
    basemap: "osm",
    layers: [countriesLayer, highlightLayer, selectionLayer],
  });

  const view = new MapView({
    container: containerId,
    map,
    zoom: 2,
    center: [10, 20],
    constraints: { minZoom: 1, maxZoom: 8 },
    // ui.components with string names fails in SDK v5 (DefaultUI2D._place error).
    // Let the SDK render its default UI, then remove unwanted widgets after when().
  });

  await view.when();

  // ── Hover: highlight + tooltip ─────────────────────────────────────────────
  view.on("pointer-move", async (event) => {
    const { results } = await view.hitTest(event, { include: [countriesLayer] });
    const hit = results[0]?.graphic;

    if (hit) {
      const attrs = hit.attributes;
      const name  = attrs.displayName ?? attrs.name ?? "Unknown";
      const score = attrs.noData ? "No data" : `AI Score: ${attrs.composite}`;

      store.setHovered(attrs.iso, name);
      showTooltip(`${name} — ${score}`, event.x, event.y);
      view.container.style.cursor = "pointer";

      // Draw a blue highlight geometry for the hovered country.
      if (hoverGraphic) highlightLayer.remove(hoverGraphic);
      hoverGraphic = new Graphic({ geometry: hit.geometry, symbol: highlightSymbol });
      highlightLayer.add(hoverGraphic);
    } else {
      store.setHovered(null);
      hideTooltip();
      view.container.style.cursor = "default";
      if (hoverGraphic) {
        highlightLayer.remove(hoverGraphic);
        hoverGraphic = null;
      }
    }
  });

  // Clear hover state when pointer leaves the view.
  view.on("pointer-leave", () => {
    store.setHovered(null);
    hideTooltip();
    view.container.style.cursor = "default";
    if (hoverGraphic) {
      highlightLayer.remove(hoverGraphic);
      hoverGraphic = null;
    }
  });

  // ── Click: toggle country selection ───────────────────────────────────────
  view.on("click", async (event) => {
    const { results } = await view.hitTest(event, { include: [countriesLayer] });
    const hit = results[0]?.graphic;
    if (!hit) return;

    const iso = hit.attributes?.iso;
    if (iso) store.toggleCountry(iso);
  });

  return view;
}

/**
 * Fly the map view to the extent of a country identified by its ISO code.
 * Falls back gracefully if the feature is not found.
 *
 * @param {import("@arcgis/core/views/MapView").default} view
 * @param {string} iso
 */
export async function flyToCountry(view, iso) {
  const layer = view.map.findLayerById("countries");
  if (!layer) return;

  const result = await layer.queryFeatures({
    where: `iso = '${iso}'`,
    returnGeometry: true,
    outFields: ["composite", "noData"],
  });

  if (result.features.length === 0) return;

  const feature = result.features[0];
  const score = feature.attributes?.noData ? null : feature.attributes?.composite;

  // Replace the selection highlight using the legend colour for this score.
  const sel = view.map.findLayerById("selection");
  if (sel) {
    sel.removeAll();
    sel.add(new Graphic({ geometry: feature.geometry, symbol: buildSelectionSymbol(score) }));
  }

  // Pass the geometry directly so the SDK handles antimeridian-crossing
  // extents correctly (e.g. USA including Alaska). Manually expanding the
  // extent can produce longitudes outside ±180° and fly the view off-map.
  await view.goTo(
    feature.geometry,
    { duration: 800, easing: "ease-in-out" }
  );
}

/**
 * Remove the red selection highlight from the map.
 * @param {import("@arcgis/core/views/MapView").default} view
 */
export function clearSelectionHighlight(view) {
  view.map.findLayerById("selection")?.removeAll();
}
