/**
 * AI Presence Dataset
 *
 * Composite score (0–100) per country built from three dimensions:
 *   daily      — AI encountered in everyday life (chatbots, recommendations, smart assistants)
 *   industry   — AI company/startup density, data centres, tech-sector size
 *   surveillance — Facial recognition, predictive policing, social scoring, CCTV density
 *
 * Sources used to calibrate scores:
 *   - Oxford Insights Government AI Readiness Index 2023
 *   - Stanford HAI AI Index 2024
 *   - OECD AI Policy Observatory country profiles
 *   - Freedom House digital freedom scores (surveillance dimension)
 *
 * Keys are ISO 3166-1 alpha-3 codes matching the world GeoJSON dataset.
 */

/** @type {Record<string, {name: string, daily: number, industry: number, surveillance: number}>} */
const RAW = {
  // ── North America ──────────────────────────────────────────────────────────
  USA: { name: "United States",      daily: 90, industry: 95, surveillance: 72 },
  CAN: { name: "Canada",             daily: 80, industry: 80, surveillance: 52 },
  MEX: { name: "Mexico",             daily: 45, industry: 35, surveillance: 35 },

  // ── Western Europe ─────────────────────────────────────────────────────────
  GBR: { name: "United Kingdom",     daily: 85, industry: 83, surveillance: 78 },
  DEU: { name: "Germany",            daily: 78, industry: 80, surveillance: 52 },
  FRA: { name: "France",             daily: 78, industry: 75, surveillance: 62 },
  NLD: { name: "Netherlands",        daily: 75, industry: 72, surveillance: 58 },
  SWE: { name: "Sweden",             daily: 78, industry: 72, surveillance: 48 },
  NOR: { name: "Norway",             daily: 75, industry: 68, surveillance: 42 },
  DNK: { name: "Denmark",            daily: 75, industry: 70, surveillance: 46 },
  FIN: { name: "Finland",            daily: 72, industry: 68, surveillance: 40 },
  CHE: { name: "Switzerland",        daily: 72, industry: 70, surveillance: 55 },
  AUT: { name: "Austria",            daily: 65, industry: 62, surveillance: 50 },
  BEL: { name: "Belgium",            daily: 68, industry: 65, surveillance: 55 },
  IRL: { name: "Ireland",            daily: 72, industry: 70, surveillance: 50 },
  ESP: { name: "Spain",              daily: 65, industry: 62, surveillance: 58 },
  ITA: { name: "Italy",              daily: 62, industry: 58, surveillance: 58 },
  PRT: { name: "Portugal",           daily: 58, industry: 52, surveillance: 46 },
  GRC: { name: "Greece",             daily: 52, industry: 45, surveillance: 48 },
  LUX: { name: "Luxembourg",         daily: 70, industry: 68, surveillance: 58 },
  ISL: { name: "Iceland",            daily: 68, industry: 65, surveillance: 46 },
  MLT: { name: "Malta",              daily: 55, industry: 50, surveillance: 50 },
  CYP: { name: "Cyprus",             daily: 50, industry: 45, surveillance: 46 },

  // ── Eastern Europe ─────────────────────────────────────────────────────────
  POL: { name: "Poland",             daily: 55, industry: 52, surveillance: 40 },
  CZE: { name: "Czech Republic",     daily: 58, industry: 55, surveillance: 42 },
  HUN: { name: "Hungary",            daily: 50, industry: 48, surveillance: 46 },
  SVK: { name: "Slovakia",           daily: 48, industry: 45, surveillance: 40 },
  ROU: { name: "Romania",            daily: 45, industry: 42, surveillance: 38 },
  BGR: { name: "Bulgaria",           daily: 42, industry: 38, surveillance: 38 },
  HRV: { name: "Croatia",            daily: 45, industry: 40, surveillance: 36 },
  SRB: { name: "Serbia",             daily: 40, industry: 35, surveillance: 40 },
  SVN: { name: "Slovenia",           daily: 52, industry: 50, surveillance: 40 },
  LVA: { name: "Latvia",             daily: 52, industry: 50, surveillance: 40 },
  LTU: { name: "Lithuania",          daily: 55, industry: 52, surveillance: 40 },
  EST: { name: "Estonia",            daily: 65, industry: 62, surveillance: 43 },
  UKR: { name: "Ukraine",            daily: 42, industry: 38, surveillance: 40 },
  BLR: { name: "Belarus",            daily: 35, industry: 30, surveillance: 55 },
  MDA: { name: "Moldova",            daily: 30, industry: 25, surveillance: 30 },
  BIH: { name: "Bosnia and Herzegovina", daily: 32, industry: 28, surveillance: 28 },
  MKD: { name: "North Macedonia",    daily: 35, industry: 30, surveillance: 30 },
  MNE: { name: "Montenegro",         daily: 32, industry: 28, surveillance: 28 },
  ALB: { name: "Albania",            daily: 30, industry: 25, surveillance: 28 },
  XKX: { name: "Kosovo",             daily: 28, industry: 22, surveillance: 26 },

  // ── East Asia & Pacific ────────────────────────────────────────────────────
  CHN: { name: "China",              daily: 88, industry: 90, surveillance: 96 },
  JPN: { name: "Japan",              daily: 82, industry: 80, surveillance: 58 },
  KOR: { name: "South Korea",        daily: 85, industry: 82, surveillance: 65 },
  AUS: { name: "Australia",          daily: 75, industry: 70, surveillance: 60 },
  NZL: { name: "New Zealand",        daily: 65, industry: 62, surveillance: 50 },
  SGP: { name: "Singapore",          daily: 82, industry: 80, surveillance: 76 },
  MYS: { name: "Malaysia",           daily: 52, industry: 48, surveillance: 50 },
  THA: { name: "Thailand",           daily: 45, industry: 40, surveillance: 46 },
  IDN: { name: "Indonesia",          daily: 42, industry: 38, surveillance: 36 },
  VNM: { name: "Vietnam",            daily: 40, industry: 35, surveillance: 40 },
  PHL: { name: "Philippines",        daily: 38, industry: 32, surveillance: 36 },
  KHM: { name: "Cambodia",           daily: 22, industry: 18, surveillance: 24 },
  LAO: { name: "Laos",               daily: 18, industry: 12, surveillance: 18 },
  MMR: { name: "Myanmar",            daily: 18, industry: 12, surveillance: 22 },
  TLS: { name: "Timor-Leste",        daily: 10, industry: 8,  surveillance: 9  },
  BRN: { name: "Brunei",             daily: 45, industry: 40, surveillance: 48 },
  PNG: { name: "Papua New Guinea",   daily: 12, industry: 8,  surveillance: 10 },
  FJI: { name: "Fiji",               daily: 20, industry: 14, surveillance: 18 },
  VUT: { name: "Vanuatu",            daily: 8,  industry: 5,  surveillance: 7  },
  SLB: { name: "Solomon Islands",    daily: 8,  industry: 5,  surveillance: 7  },
  WSM: { name: "Samoa",              daily: 12, industry: 8,  surveillance: 10 },
  TON: { name: "Tonga",              daily: 10, industry: 6,  surveillance: 8  },
  KIR: { name: "Kiribati",           daily: 8,  industry: 4,  surveillance: 6  },
  MHL: { name: "Marshall Islands",   daily: 8,  industry: 4,  surveillance: 6  },
  FSM: { name: "Micronesia",         daily: 8,  industry: 4,  surveillance: 6  },
  PLW: { name: "Palau",              daily: 10, industry: 6,  surveillance: 8  },
  NRU: { name: "Nauru",              daily: 8,  industry: 4,  surveillance: 6  },
  TUV: { name: "Tuvalu",             daily: 6,  industry: 3,  surveillance: 5  },

  // ── South Asia ─────────────────────────────────────────────────────────────
  IND: { name: "India",              daily: 62, industry: 65, surveillance: 58 },
  PAK: { name: "Pakistan",           daily: 28, industry: 22, surveillance: 30 },
  BGD: { name: "Bangladesh",         daily: 25, industry: 20, surveillance: 24 },
  LKA: { name: "Sri Lanka",          daily: 30, industry: 25, surveillance: 26 },
  NPL: { name: "Nepal",              daily: 18, industry: 12, surveillance: 14 },
  BTN: { name: "Bhutan",             daily: 12, industry: 8,  surveillance: 8  },
  MDV: { name: "Maldives",           daily: 22, industry: 15, surveillance: 16 },
  AFG: { name: "Afghanistan",        daily: 8,  industry: 5,  surveillance: 8  },

  // ── Central Asia ───────────────────────────────────────────────────────────
  KAZ: { name: "Kazakhstan",         daily: 42, industry: 38, surveillance: 42 },
  UZB: { name: "Uzbekistan",         daily: 28, industry: 22, surveillance: 32 },
  KGZ: { name: "Kyrgyzstan",         daily: 20, industry: 15, surveillance: 20 },
  TJK: { name: "Tajikistan",         daily: 15, industry: 10, surveillance: 18 },
  TKM: { name: "Turkmenistan",       daily: 18, industry: 12, surveillance: 30 },
  MNG: { name: "Mongolia",           daily: 22, industry: 15, surveillance: 20 },

  // ── Caucasus ───────────────────────────────────────────────────────────────
  GEO: { name: "Georgia",            daily: 35, industry: 28, surveillance: 34 },
  ARM: { name: "Armenia",            daily: 38, industry: 32, surveillance: 30 },
  AZE: { name: "Azerbaijan",         daily: 40, industry: 35, surveillance: 40 },

  // ── Russia ─────────────────────────────────────────────────────────────────
  RUS: { name: "Russia",             daily: 55, industry: 55, surveillance: 68 },

  // ── Middle East ────────────────────────────────────────────────────────────
  ISR: { name: "Israel",             daily: 78, industry: 78, surveillance: 68 },
  UAE: { name: "United Arab Emirates", daily: 75, industry: 68, surveillance: 70 },
  SAU: { name: "Saudi Arabia",       daily: 60, industry: 55, surveillance: 62 },
  QAT: { name: "Qatar",              daily: 62, industry: 58, surveillance: 66 },
  KWT: { name: "Kuwait",             daily: 55, industry: 50, surveillance: 58 },
  BHR: { name: "Bahrain",            daily: 58, industry: 52, surveillance: 60 },
  OMN: { name: "Oman",               daily: 48, industry: 42, surveillance: 46 },
  JOR: { name: "Jordan",             daily: 42, industry: 35, surveillance: 36 },
  LBN: { name: "Lebanon",            daily: 38, industry: 32, surveillance: 34 },
  TUR: { name: "Turkey",             daily: 50, industry: 45, surveillance: 54 },
  IRN: { name: "Iran",               daily: 38, industry: 35, surveillance: 52 },
  IRQ: { name: "Iraq",               daily: 20, industry: 15, surveillance: 22 },
  SYR: { name: "Syria",              daily: 12, industry: 8,  surveillance: 18 },
  YEM: { name: "Yemen",              daily: 10, industry: 6,  surveillance: 8  },
  PSE: { name: "Palestine",          daily: 28, industry: 20, surveillance: 24 },

  // ── North Africa ───────────────────────────────────────────────────────────
  MAR: { name: "Morocco",            daily: 35, industry: 28, surveillance: 30 },
  DZA: { name: "Algeria",            daily: 30, industry: 25, surveillance: 30 },
  TUN: { name: "Tunisia",            daily: 32, industry: 28, surveillance: 28 },
  LBY: { name: "Libya",              daily: 18, industry: 12, surveillance: 15 },
  EGY: { name: "Egypt",              daily: 38, industry: 32, surveillance: 42 },
  SDN: { name: "Sudan",              daily: 14, industry: 10, surveillance: 15 },

  // ── Sub-Saharan Africa ─────────────────────────────────────────────────────
  NGA: { name: "Nigeria",            daily: 32, industry: 28, surveillance: 26 },
  GHA: { name: "Ghana",              daily: 30, industry: 25, surveillance: 22 },
  KEN: { name: "Kenya",              daily: 35, industry: 28, surveillance: 28 },
  ZAF: { name: "South Africa",       daily: 45, industry: 40, surveillance: 40 },
  ETH: { name: "Ethiopia",           daily: 15, industry: 10, surveillance: 15 },
  TZA: { name: "Tanzania",           daily: 18, industry: 12, surveillance: 14 },
  UGA: { name: "Uganda",             daily: 15, industry: 10, surveillance: 12 },
  RWA: { name: "Rwanda",             daily: 22, industry: 18, surveillance: 22 },
  ZMB: { name: "Zambia",             daily: 14, industry: 10, surveillance: 12 },
  ZWE: { name: "Zimbabwe",           daily: 15, industry: 10, surveillance: 13 },
  MOZ: { name: "Mozambique",         daily: 12, industry: 8,  surveillance: 10 },
  MDG: { name: "Madagascar",         daily: 10, industry: 7,  surveillance: 8  },
  MWI: { name: "Malawi",             daily: 12, industry: 7,  surveillance: 9  },
  CMR: { name: "Cameroon",           daily: 18, industry: 12, surveillance: 14 },
  SEN: { name: "Senegal",            daily: 20, industry: 15, surveillance: 18 },
  CIV: { name: "Côte d'Ivoire",      daily: 18, industry: 14, surveillance: 14 },
  TOG: { name: "Togo",               daily: 14, industry: 10, surveillance: 12 },
  BEN: { name: "Benin",              daily: 15, industry: 10, surveillance: 12 },
  NER: { name: "Niger",              daily: 5,  industry: 3,  surveillance: 5  },
  MLI: { name: "Mali",               daily: 8,  industry: 5,  surveillance: 8  },
  BFA: { name: "Burkina Faso",       daily: 8,  industry: 5,  surveillance: 8  },
  GIN: { name: "Guinea",             daily: 10, industry: 6,  surveillance: 8  },
  SLE: { name: "Sierra Leone",       daily: 8,  industry: 5,  surveillance: 7  },
  LBR: { name: "Liberia",            daily: 8,  industry: 5,  surveillance: 7  },
  GNB: { name: "Guinea-Bissau",      daily: 6,  industry: 3,  surveillance: 5  },
  GMB: { name: "Gambia",             daily: 10, industry: 7,  surveillance: 8  },
  MRT: { name: "Mauritania",         daily: 10, industry: 7,  surveillance: 8  },
  CPV: { name: "Cape Verde",         daily: 22, industry: 15, surveillance: 18 },
  STP: { name: "São Tomé and Príncipe", daily: 8, industry: 5, surveillance: 6 },
  GAB: { name: "Gabon",              daily: 20, industry: 15, surveillance: 18 },
  GNQ: { name: "Equatorial Guinea",  daily: 10, industry: 7,  surveillance: 8  },
  COG: { name: "Republic of the Congo", daily: 15, industry: 10, surveillance: 12 },
  COD: { name: "DR Congo",           daily: 10, industry: 7,  surveillance: 8  },
  AGO: { name: "Angola",             daily: 20, industry: 15, surveillance: 18 },
  NAM: { name: "Namibia",            daily: 28, industry: 22, surveillance: 22 },
  BWA: { name: "Botswana",           daily: 30, industry: 25, surveillance: 24 },
  SWZ: { name: "Eswatini",           daily: 15, industry: 10, surveillance: 12 },
  LSO: { name: "Lesotho",            daily: 12, industry: 8,  surveillance: 10 },
  CAF: { name: "Central African Republic", daily: 5, industry: 3, surveillance: 4 },
  TCD: { name: "Chad",               daily: 6,  industry: 3,  surveillance: 5  },
  SOM: { name: "Somalia",            daily: 4,  industry: 2,  surveillance: 3  },
  ERI: { name: "Eritrea",            daily: 4,  industry: 2,  surveillance: 6  },
  DJI: { name: "Djibouti",           daily: 15, industry: 10, surveillance: 15 },
  SSD: { name: "South Sudan",        daily: 5,  industry: 2,  surveillance: 4  },
  BDI: { name: "Burundi",            daily: 6,  industry: 3,  surveillance: 6  },
  COM: { name: "Comoros",            daily: 8,  industry: 5,  surveillance: 6  },
  MUS: { name: "Mauritius",          daily: 35, industry: 28, surveillance: 28 },
  SYC: { name: "Seychelles",         daily: 25, industry: 18, surveillance: 20 },

  // ── South America ──────────────────────────────────────────────────────────
  BRA: { name: "Brazil",             daily: 48, industry: 42, surveillance: 40 },
  ARG: { name: "Argentina",          daily: 45, industry: 40, surveillance: 36 },
  CHL: { name: "Chile",              daily: 45, industry: 40, surveillance: 36 },
  COL: { name: "Colombia",           daily: 40, industry: 35, surveillance: 34 },
  PER: { name: "Peru",               daily: 28, industry: 22, surveillance: 24 },
  VEN: { name: "Venezuela",          daily: 22, industry: 18, surveillance: 28 },
  ECU: { name: "Ecuador",            daily: 25, industry: 20, surveillance: 22 },
  BOL: { name: "Bolivia",            daily: 20, industry: 15, surveillance: 18 },
  PRY: { name: "Paraguay",           daily: 20, industry: 15, surveillance: 18 },
  URY: { name: "Uruguay",            daily: 45, industry: 38, surveillance: 34 },
  GUY: { name: "Guyana",             daily: 18, industry: 12, surveillance: 14 },
  SUR: { name: "Suriname",           daily: 20, industry: 14, surveillance: 16 },

  // ── Central America & Caribbean ────────────────────────────────────────────
  GTM: { name: "Guatemala",          daily: 18, industry: 12, surveillance: 14 },
  BLZ: { name: "Belize",             daily: 15, industry: 10, surveillance: 12 },
  HND: { name: "Honduras",           daily: 15, industry: 10, surveillance: 14 },
  SLV: { name: "El Salvador",        daily: 18, industry: 12, surveillance: 18 },
  NIC: { name: "Nicaragua",          daily: 15, industry: 10, surveillance: 12 },
  CRI: { name: "Costa Rica",         daily: 38, industry: 32, surveillance: 28 },
  PAN: { name: "Panama",             daily: 32, industry: 28, surveillance: 26 },
  CUB: { name: "Cuba",               daily: 18, industry: 12, surveillance: 28 },
  JAM: { name: "Jamaica",            daily: 22, industry: 15, surveillance: 20 },
  HTI: { name: "Haiti",              daily: 8,  industry: 5,  surveillance: 7  },
  DOM: { name: "Dominican Republic", daily: 22, industry: 15, surveillance: 20 },
  TTO: { name: "Trinidad and Tobago", daily: 28, industry: 22, surveillance: 22 },
  BRB: { name: "Barbados",           daily: 30, industry: 22, surveillance: 22 },

  // ── North Korea (anomaly: low daily use, high internal surveillance) ────────
  PRK: { name: "North Korea",        daily: 5,  industry: 3,  surveillance: 22 },
};

// ── Compute composite ─────────────────────────────────────────────────────────

/** @typedef {{ name: string, daily: number, industry: number, surveillance: number, composite: number, noData: false }} CountryData */
/** @typedef {{ name: string, daily: null, industry: null, surveillance: null, composite: null, noData: true }} NoDataEntry */

/** @type {Record<string, CountryData>} */
export const AI_DATA = Object.fromEntries(
  Object.entries(RAW).map(([iso, d]) => [
    iso,
    {
      ...d,
      composite: Math.round((d.daily + d.industry + d.surveillance) / 3),
      noData: false,
    },
  ])
);

// ── Default for unknown countries ─────────────────────────────────────────────

/** @returns {NoDataEntry} */
export function getDefaultEntry(name = "Unknown") {
  return { name, daily: null, industry: null, surveillance: null, composite: null, noData: true };
}

// ── Lookups ────────────────────────────────────────────────────────────────────

/**
 * Returns the entry for an ISO code, or a no-data placeholder.
 * @param {string} iso
 * @param {string} [fallbackName]
 * @returns {CountryData | NoDataEntry}
 */
export function getCountryData(iso, fallbackName) {
  return AI_DATA[iso] ?? getDefaultEntry(fallbackName ?? iso);
}

/**
 * Returns all countries with data, sorted by composite score ascending
 * (lowest AI exposure first).
 * @returns {Array<{iso: string} & CountryData>}
 */
export function getRankedCountries() {
  return Object.entries(AI_DATA)
    .map(([iso, data]) => ({ iso, ...data }))
    .sort((a, b) => a.composite - b.composite);
}

/**
 * Returns the label for a composite score.
 * @param {number | null} score
 * @returns {string}
 */
export function getScoreLabel(score) {
  if (score === null) return "No data";
  if (score <= 20)  return "Virtually no AI";
  if (score <= 40)  return "Low AI presence";
  if (score <= 60)  return "Moderate AI presence";
  if (score <= 80)  return "High AI presence";
  return "AI-saturated";
}

/**
 * Returns the hex colour for a composite score (matching the map renderer).
 * @param {number | null} score
 * @returns {string}
 */
export function getScoreColor(score) {
  if (score === null) return "#c8c8c8";
  if (score <= 20)  return "#1a9641";
  if (score <= 40)  return "#78c679";
  if (score <= 60)  return "#c9e88a";
  if (score <= 80)  return "#fdae61";
  return "#d7191c";
}
