import {
  getRankedCountries,
  getCountryData,
  getScoreLabel,
  getScoreColor,
} from "../data/aiPresence.js";
import { store } from "../state/store.js";
import { flyToCountry, clearSelectionHighlight } from "../map/initMap.js";

// ── DOM refs ──────────────────────────────────────────────────────────────────
const rankedList    = document.getElementById("ranked-list");
const detailBlock   = document.getElementById("detail-block");
const detailContent = document.getElementById("detail-content");
const compareBlock  = document.getElementById("compare-block");
const compareContent= document.getElementById("compare-content");
const clearBtn      = document.getElementById("clear-btn");

// ── Ranked list ───────────────────────────────────────────────────────────────

/** Render all countries ranked lowest-to-highest AI presence. */
function renderRankedList(view) {
  const allCountries = getRankedCountries();

  rankedList.innerHTML = allCountries
    .map(
      ({ iso, name, composite }, i) => `
        <calcite-list-item
          data-iso="${iso}"
          label="${i + 1}. ${name}"
          description="${getScoreLabel(composite)}"
        >
          <calcite-chip
            slot="content-end"
            scale="s"
            style="--calcite-color-foreground-1:${getScoreColor(composite)};color:#000;font-weight:700"
          >${composite}</calcite-chip>
        </calcite-list-item>
      `
    )
    .join("");

  // Delegate click on any list item
  rankedList.addEventListener("calciteListItemSelect", async (e) => {
    const item = e.target.closest("calcite-list-item");
    if (!item) return;
    const iso = item.dataset.iso;
    if (!iso) return;
    store.toggleCountry(iso);
    await flyToCountry(view, iso);
  });
}

// ── Score bar helper ──────────────────────────────────────────────────────────

function scoreBar(label, value) {
  if (value === null || value === -1) return "";
  const color = getScoreColor(value);
  return `
    <div class="score-row">
      <span class="score-label">${label}</span>
      <div class="score-track">
        <div class="score-fill" style="width:${value}%;background:${color}"></div>
      </div>
      <span class="score-value">${value}</span>
    </div>
  `;
}

// ── Detail view ───────────────────────────────────────────────────────────────

function renderDetail(isos) {
  detailBlock.hidden = false;

  if (isos.length === 0) {
    detailBlock.heading = "Country Detail";
    detailContent.innerHTML = `<p class="no-data-msg">Click a country in the list below to see its details.</p>`;
    return;
  }

  const iso  = isos[isos.length - 1]; // show the most recently selected country
  const data = getCountryData(iso);

  detailBlock.hidden = false;
  detailBlock.heading = data.name;

  if (data.noData) {
    detailContent.innerHTML = `<p class="no-data-msg">No AI presence data available for ${data.name}.</p>`;
    return;
  }

  const color = getScoreColor(data.composite);

  detailContent.innerHTML = `
    <div class="detail-score" style="border-left: 4px solid ${color}">
      <span class="detail-score-value" style="color:${color}">${data.composite}</span>
      <span class="detail-score-label">${getScoreLabel(data.composite)}</span>
    </div>
    <div class="score-bars">
      ${scoreBar("Daily Life AI",   data.daily)}
      ${scoreBar("Industry AI",     data.industry)}
      ${scoreBar("Surveillance AI", data.surveillance)}
    </div>
    <p class="score-note">
      Scores are composites of Oxford Insights Government AI Readiness Index,
      Stanford HAI AI Index, and OECD AI Policy Observatory data.
    </p>
  `;
}

// ── Comparison panel ──────────────────────────────────────────────────────────

function renderComparison(isos) {
  if (isos.length < 2) {
    compareBlock.hidden = true;
    return;
  }

  compareBlock.hidden = false;

  const cols = isos
    .map((iso) => {
      const data = getCountryData(iso);
      const color = getScoreColor(data.composite);
      if (data.noData) {
        return `
          <div class="compare-col">
            <div class="compare-name">${data.name}</div>
            <div class="compare-score no-data-msg">No data</div>
          </div>
        `;
      }
      return `
        <div class="compare-col">
          <div class="compare-name">${data.name}</div>
          <div class="compare-score" style="color:${color}">${data.composite}</div>
          <div class="compare-sublabel">${getScoreLabel(data.composite)}</div>
          <div class="compare-dims">
            <div class="compare-dim">
              <span>Daily</span>
              <strong style="color:${getScoreColor(data.daily)}">${data.daily}</strong>
            </div>
            <div class="compare-dim">
              <span>Industry</span>
              <strong style="color:${getScoreColor(data.industry)}">${data.industry}</strong>
            </div>
            <div class="compare-dim">
              <span>Surveillance</span>
              <strong style="color:${getScoreColor(data.surveillance)}">${data.surveillance}</strong>
            </div>
          </div>
        </div>
      `;
    })
    .join('<div class="compare-divider"></div>');

  compareContent.innerHTML = `<div class="compare-grid">${cols}</div>`;
}

// ── Highlight selected items in the ranked list ───────────────────────────────

function updateListHighlights(isos) {
  rankedList.querySelectorAll("calcite-list-item").forEach((item) => {
    if (isos.includes(item.dataset.iso)) {
      item.selected = true;
    } else {
      item.selected = false;
    }
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────

/**
 * Wire up the sidebar to the store and the map view.
 * @param {import("@arcgis/core/views/MapView").default} view
 */
export function initSidebar(view) {
  renderRankedList(view);
  renderDetail([]);

  store.on("selectionChanged", (isos) => {
    renderDetail(isos);
    renderComparison(isos);
    updateListHighlights(isos);
  });

  clearBtn?.addEventListener("click", () => {
    store.clearSelection();
    clearSelectionHighlight(view);
  });
}
