import ClassBreaksRenderer from "@arcgis/core/renderers/ClassBreaksRenderer.js";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol.js";

const outline = { color: [255, 255, 255, 0.6], width: 0.4 };
const selectedOutline = { color: [30, 144, 255, 1], width: 2.5 };

function fill(hex, alpha = 0.85) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return new SimpleFillSymbol({ color: [r, g, b, alpha], outline });
}

/**
 * ClassBreaksRenderer colouring countries by their `composite` AI score.
 * Green (safe) → Red (saturated).
 */
export const aiRenderer = new ClassBreaksRenderer({
  field: "composite",
  defaultSymbol: new SimpleFillSymbol({
    color: [200, 200, 200, 0.5],
    outline,
  }),
  defaultLabel: "No data",
  classBreakInfos: [
    {
      minValue: 0,
      maxValue: 20,
      symbol: fill("#1a9641"),
      label: "0–20 — Virtually no AI",
    },
    {
      minValue: 20.001,
      maxValue: 40,
      symbol: fill("#78c679"),
      label: "21–40 — Low AI presence",
    },
    {
      minValue: 40.001,
      maxValue: 60,
      symbol: fill("#c9e88a"),
      label: "41–60 — Moderate AI presence",
    },
    {
      minValue: 60.001,
      maxValue: 80,
      symbol: fill("#fdae61"),
      label: "61–80 — High AI presence",
    },
    {
      minValue: 80.001,
      maxValue: 100,
      symbol: fill("#d7191c"),
      label: "81–100 — AI-saturated",
    },
  ],
});

/** Highlight symbol used when a country is selected/hovered. */
export const highlightSymbol = new SimpleFillSymbol({
  color: [30, 144, 255, 0.25],
  outline: selectedOutline,
});
