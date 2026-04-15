# AI-Free Zones

## What This Is

A web mapping application that shows where in the world you are least likely to encounter AI technology. Users can explore a world choropleth map, browse a ranked list of the lowest-AI countries, and compare regions side-by-side to inform decisions about where to live, travel, or simply satisfy curiosity about the global distribution of AI exposure.

## Core Value

A single, at-a-glance world map that lets anyone instantly see which countries and regions have the lowest composite AI presence — so they can compare and choose accordingly.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] World choropleth map colored by composite AI presence score (0–100) per country
- [ ] Composite score reflects three dimensions: AI in daily life, AI industry/tech sector density, and AI surveillance systems
- [ ] Built-in curated static dataset based on published indices (Oxford AI Readiness, Stanford HAI, etc.)
- [ ] Ranked sidebar list of countries from lowest to highest AI presence score
- [ ] Clickable countries on map to view detail: score breakdown by dimension, country info
- [ ] Side-by-side comparison of selected countries' scores
- [ ] Country-level granularity for v1, with architecture that supports sub-national drill-down later
- [ ] Esri Maps SDK for JavaScript 5.0 + Calcite Components 5.0 UI
- [ ] Vite build tooling, Vitest unit tests, Playwright E2E tests

### Out of Scope

- Sub-national / regional data in v1 — defer until country layer is stable and data sourcing is solved
- Live/real-time data feeds — static curated dataset is intentional for v1 reliability
- User accounts or saved comparisons — no auth needed for an informational map tool
- AI presence forecasting or historical trends — current snapshot only for v1

## Context

- Tech stack is fixed: Esri Maps SDK for JavaScript 5.0, Esri Calcite Components 5.0, Vite, Vitest, Playwright CLI
- Data will be embedded as a static JS module — sourced from publicly available AI readiness indices and synthesized into a composite score
- The Esri ArcGIS Maps SDK requires configuration for asset paths when using npm/Vite; world country polygons will be loaded via GeoJSONLayer using a blob URL pattern (fetch GeoJSON → merge AI scores → create object URL)
- An ArcGIS API key may be required for certain basemaps; the app should gracefully work with OSM-based or key-free basemaps
- The "comparison" feature means users can select multiple countries and see their scores in a panel, not just view one at a time

## Constraints

- **Tech Stack**: Esri Maps SDK for JavaScript 5.0 + Calcite Components 5.0 — mandated, no substitutions
- **Build**: Vite — all tooling flows through Vite
- **Testing**: Vitest for unit tests, Playwright CLI for E2E
- **Data**: Static embedded dataset for v1 — no runtime API calls to external data sources
- **Granularity**: Country-level v1, but data model and layer architecture must support sub-national layers later

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Static curated dataset | Reliability and offline-ability; no API key or rate limits for data | — Pending |
| Blob URL pattern for GeoJSONLayer | Allows merging AI scores into GeoJSON before layer creation without a backend | — Pending |
| Country-level v1, sub-national later | Scope control; country data is well-sourced, regional data is sparse | — Pending |
| Composite 3-dimension score | User wants industry + daily life + surveillance combined into one index | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-15 after initialization*
