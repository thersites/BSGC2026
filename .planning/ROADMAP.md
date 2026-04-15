# Roadmap: AI-Free Zones

## Overview

Four phases take this project from empty directory to a fully tested, interactive world choropleth map. Phase 1 establishes the Vite + ArcGIS + Calcite scaffold so everything downstream has a working dev environment to build against. Phase 2 delivers the map's core substance — a static AI presence dataset merged into a GeoJSONLayer with choropleth rendering and country interaction. Phase 3 wraps the map in a complete Calcite Shell UI: ranked sidebar list, detail view, comparison panel, legend, and responsive layout. Phase 4 closes the loop with Vitest unit tests and Playwright E2E tests that verify the data module and end-to-end user flows.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Project Setup** - Vite scaffold with ArcGIS + Calcite deps, dev server running, Vitest + Playwright configured
- [ ] **Phase 2: Map + Data** - Static AI dataset, GeoJSONLayer choropleth, country hover and click interaction
- [ ] **Phase 3: Sidebar + UI** - Calcite Shell layout, ranked list, detail view, comparison panel, legend, responsive layout
- [ ] **Phase 4: Testing** - Vitest unit tests for data module, Playwright E2E for app load and country selection

## Phase Details

### Phase 1: Project Setup
**Goal**: A working Vite dev server with ArcGIS Maps SDK and Calcite Components installed, asset paths configured, and test runners ready to receive tests.
**Depends on**: Nothing (first phase)
**Requirements**: SETUP-01, SETUP-02, SETUP-03, SETUP-04, SETUP-05
**Success Criteria** (what must be TRUE):
  1. `npm run dev` starts without errors and the app is accessible at localhost
  2. ArcGIS asset path is configured so SDK workers and assets load without 404s
  3. `npm run test` runs Vitest without configuration errors (zero tests is OK)
  4. `npx playwright test` runs without configuration errors (zero tests is OK)
**Plans**: 2 plans

Plans:
- [ ] 01-01: Vite scaffold — initialize project, install `@arcgis/core` 5.0 and `@esri/calcite-components` 5.0, configure ArcGIS asset path, verify dev server
- [ ] 01-02: Test tooling — configure Vitest (jsdom environment, coverage) and Playwright (base URL, default browser), verify both runners execute

### Phase 2: Map + Data
**Goal**: A full-screen world choropleth map rendered from a static AI presence dataset, with country hover tooltips and click-to-select interaction.
**Depends on**: Phase 1
**Requirements**: MAP-01, MAP-02, MAP-03, MAP-04, MAP-05, MAP-06, DATA-01, DATA-02, DATA-03, DATA-04, DATA-05
**Success Criteria** (what must be TRUE):
  1. The map fills the viewport and renders a key-free basemap at world extent on load
  2. Every country polygon is filled with a color from the green-to-red choropleth scale reflecting its composite AI score
  3. Hovering a country shows a tooltip with the country name and composite score
  4. Clicking a country visually selects it (highlight changes) and emits a selection event consumable by the sidebar
  5. Countries missing from the dataset render in a neutral color and are flagged as "no data"
**Plans**: 2 plans

Plans:
- [ ] 02-01: Data module — author static AI presence dataset (150+ countries, ISO alpha-3 codes, composite + 3 sub-scores), annotated with source index references; export lookup-by-ISO and sorted ranked array; handle missing-country defaults
- [ ] 02-02: Map layer + interaction — implement `MapView` with key-free basemap, build GeoJSONLayer via blob URL pattern (fetch world GeoJSON → merge AI scores → object URL), apply `ClassBreaksRenderer` (5 classes, green → red), wire hover tooltip and click selection

**UI hint**: yes

### Phase 3: Sidebar + UI
**Goal**: A complete Calcite Shell application shell wrapping the map with a ranked sidebar list, country detail view, comparison panel, legend, header, and responsive layout.
**Depends on**: Phase 2
**Requirements**: SIDE-01, SIDE-02, SIDE-03, SIDE-04, SIDE-05, SIDE-06, UI-01, UI-02, UI-03, UI-04
**Success Criteria** (what must be TRUE):
  1. The sidebar lists the top 20 lowest-AI countries ranked by composite score; clicking any entry flies the map to that country and selects it
  2. Selecting a country (from map or sidebar) populates a detail view showing name, composite score, all three sub-scores, and source notes
  3. Up to 3 countries can be added to a comparison panel showing their scores side-by-side; "Clear selection" resets the comparison state
  4. The map legend is visible and correctly labels the 5 choropleth color classes with their score ranges
  5. On narrow viewports the sidebar collapses and the layout remains usable
**Plans**: 2 plans

Plans:
- [ ] 03-01: Shell layout + sidebar list — implement `calcite-shell` with collapsible panel, render ranked top-20 list, wire list-item click to map fly-to and selection, apply header with title and description
- [ ] 03-02: Detail view + comparison + legend — implement selected-country detail view (scores + source notes), comparison panel (up to 3, clear button), map legend component, Calcite design tokens, responsive collapse behavior

**UI hint**: yes

### Phase 4: Testing
**Goal**: Vitest unit tests covering the data module and score logic, plus Playwright E2E tests verifying app load and country selection, all passing in CI.
**Depends on**: Phase 3
**Requirements**: TEST-01, TEST-02, TEST-03, TEST-04
**Success Criteria** (what must be TRUE):
  1. `npm run test` passes with unit tests covering score lookup, ranking array, composite calculation, and missing-country defaults
  2. `npx playwright test` passes with E2E tests confirming the app loads and the map renders without console errors
  3. `npx playwright test` passes with an E2E test confirming that clicking a country on the map populates the sidebar detail view
**Plans**: 1 plan

Plans:
- [ ] 04-01: Test suite — write Vitest unit tests for data module (lookup, ranking, defaults) and composite score logic; write Playwright E2E tests for app load + map render and country click → sidebar population

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Project Setup | 0/2 | Not started | - |
| 2. Map + Data | 0/2 | Not started | - |
| 3. Sidebar + UI | 0/2 | Not started | - |
| 4. Testing | 0/1 | Not started | - |
