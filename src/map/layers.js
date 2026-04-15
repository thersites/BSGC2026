import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";
import { AI_DATA, getDefaultEntry } from "../data/aiPresence.js";
import { aiRenderer } from "./renderer.js";

/**
 * Public GeoJSON source — Natural Earth 110m countries.
 * ISO_A3 field matches our AI dataset keys.
 */
const GEOJSON_URL =
  "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

/**
 * Fetches the world countries GeoJSON, merges AI presence scores into each
 * feature's properties, and returns a blob: URL suitable for GeoJSONLayer.
 *
 * @returns {Promise<string>} Object URL
 */
async function buildEnrichedGeoJSONUrl() {
  const resp = await fetch(GEOJSON_URL);
  if (!resp.ok) throw new Error(`Failed to fetch world GeoJSON: ${resp.status}`);
  const geoJSON = await resp.json();

  const enriched = {
    ...geoJSON,
    features: geoJSON.features.map((feature) => {
      const iso = feature.properties?.ISO_A3 ?? "";
      const data = AI_DATA[iso] ?? getDefaultEntry(feature.properties?.ADMIN ?? iso);
      return {
        ...feature,
        properties: {
          ...feature.properties,
          iso,
          composite:   data.noData ? -1 : data.composite,
          daily:       data.noData ? -1 : data.daily,
          industry:    data.noData ? -1 : data.industry,
          surveillance: data.noData ? -1 : data.surveillance,
          noData:      data.noData ? 1 : 0,
          displayName: data.name ?? feature.properties?.ADMIN ?? iso,
        },
      };
    }),
  };

  const blob = new Blob([JSON.stringify(enriched)], { type: "application/geo+json" });
  return URL.createObjectURL(blob);
}

/**
 * Creates and returns the world countries GeoJSONLayer enriched with AI scores.
 * @returns {Promise<import("@arcgis/core/layers/GeoJSONLayer").default>}
 */
export async function createCountriesLayer() {
  const url = await buildEnrichedGeoJSONUrl();

  return new GeoJSONLayer({
    id: "countries",
    url,
    title: "AI Presence by Country",
    renderer: aiRenderer,
    // Disable the default Esri popup; we handle selection in the sidebar.
    popupEnabled: false,
    fields: [
      { name: "ADMIN",       alias: "Country",        type: "string" },
      { name: "iso",         alias: "ISO Code",       type: "string" },
      { name: "displayName", alias: "Display Name",   type: "string" },
      { name: "composite",   alias: "AI Score",       type: "integer" },
      { name: "daily",       alias: "Daily Life AI",  type: "integer" },
      { name: "industry",    alias: "Industry AI",    type: "integer" },
      { name: "surveillance",alias: "Surveillance AI",type: "integer" },
      { name: "noData",      alias: "No Data",        type: "integer" },
    ],
    outFields: ["*"],
    spatialReference: { wkid: 4326 },
  });
}
