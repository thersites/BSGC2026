# Requirements: AI-Free Zones

**Defined:** 2026-04-15
**Core Value:** A single, at-a-glance world map that lets anyone instantly see which countries and regions have the lowest composite AI presence — so they can compare and choose accordingly.

## v1 Requirements

### Project Setup

- [ ] **SETUP-01**: Vite project initialized with `@arcgis/core` 5.0 and `@esri/calcite-components` 5.0 as npm dependencies
- [ ] **SETUP-02**: ArcGIS asset path configured correctly for Vite dev server and production build
- [ ] **SETUP-03**: Vitest configured for unit tests
- [ ] **SETUP-04**: Playwright configured for E2E tests
- [ ] **SETUP-05**: App runs at localhost with `npm run dev`

### Map

- [ ] **MAP-01**: Full-screen `MapView` renders with a basemap that works without an API key
- [ ] **MAP-02**: World countries GeoJSON loaded as a `GeoJSONLayer` using the blob URL pattern (fetch → merge AI scores → object URL)
- [ ] **MAP-03**: Countries colored by composite AI presence score using a `ClassBreaksRenderer` (5 classes, green → red)
- [ ] **MAP-04**: Hovering a country highlights it and shows a tooltip with country name and score
- [ ] **MAP-05**: Clicking a country selects it and populates the detail panel
- [ ] **MAP-06**: Map extent defaults to a world view

### Data

- [ ] **DATA-01**: Static AI presence dataset covers ≥150 countries with ISO 3166-1 alpha-3 codes
- [ ] **DATA-02**: Each country has a composite score (0–100) and three sub-scores: daily-life AI, industry AI, surveillance AI
- [ ] **DATA-03**: Dataset is sourced from / annotated with public indices (Oxford Insights, Stanford HAI, etc.)
- [ ] **DATA-04**: Data module exports a lookup by ISO code and a sorted ranked array
- [ ] **DATA-05**: Countries not in dataset default to a neutral mid-range score with a "no data" flag

### Sidebar

- [ ] **SIDE-01**: Calcite Shell layout with a collapsible left panel
- [ ] **SIDE-02**: Ranked list of top 20 lowest-AI countries visible in the sidebar
- [ ] **SIDE-03**: Clicking a country in the ranked list flies the map to that country and selects it
- [ ] **SIDE-04**: Selected country detail view shows: name, composite score, per-dimension scores, source notes
- [ ] **SIDE-05**: Comparison panel shows up to 3 selected countries side-by-side with their scores
- [ ] **SIDE-06**: "Clear selection" button resets comparison state

### Legend & UI

- [ ] **UI-01**: Map legend showing the 5 color classes with score ranges
- [ ] **UI-02**: App header with title and brief description
- [ ] **UI-03**: Calcite design tokens / theme applied consistently
- [ ] **UI-04**: Responsive layout — sidebar collapses on narrow viewports

### Testing

- [ ] **TEST-01**: Unit tests for AI data module (score lookup, ranking, defaults)
- [ ] **TEST-02**: Unit tests for score calculation / composite logic
- [ ] **TEST-03**: Playwright E2E: app loads and map renders
- [ ] **TEST-04**: Playwright E2E: clicking a country populates the sidebar

## v2 Requirements

### Sub-National Drill-Down

- **SUB-01**: Clicking a country zooms in to reveal regional / state-level data
- **SUB-02**: Sub-national GeoJSON layers loaded on demand per country
- **SUB-03**: Regional AI scores available for high-interest countries (USA, China, EU members)

### Data Updates

- **UPD-01**: Dataset versioned with a "last updated" date shown in UI
- **UPD-02**: Admin workflow to refresh scores from source indices

### Sharing

- **SHARE-01**: URL encodes selected country(s) for shareable links
- **SHARE-02**: "Copy link" button in comparison panel

## Out of Scope

| Feature | Reason |
|---------|--------|
| User accounts / saved comparisons | No server needed; informational tool only |
| Real-time or live data feeds | Static curated data is intentional for v1 reliability |
| AI presence forecasting / trends | Snapshot only; historical analysis is a separate product |
| Mobile native app | Web-first; Calcite + ArcGIS are web-native |
| Sub-national data in v1 | Data sourcing is complex; country level ships faster |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SETUP-01 through SETUP-05 | Phase 1 | Pending |
| MAP-01 through MAP-06 | Phase 2 | Pending |
| DATA-01 through DATA-05 | Phase 2 | Pending |
| SIDE-01 through SIDE-06 | Phase 3 | Pending |
| UI-01 through UI-04 | Phase 3 | Pending |
| TEST-01 through TEST-04 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 29 total
- Mapped to phases: 29
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-15*
*Last updated: 2026-04-15 after initial definition*
