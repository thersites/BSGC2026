import { describe, it, expect } from "vitest";
import {
  AI_DATA,
  getCountryData,
  getRankedCountries,
  getScoreLabel,
  getScoreColor,
  getDefaultEntry,
} from "../../src/data/aiPresence.js";

// ── Dataset integrity ─────────────────────────────────────────────────────────

describe("AI_DATA dataset", () => {
  it("contains at least 150 countries", () => {
    expect(Object.keys(AI_DATA).length).toBeGreaterThanOrEqual(150);
  });

  it("every entry has a composite score between 0 and 100", () => {
    Object.entries(AI_DATA).forEach(([iso, data]) => {
      expect(data.composite, `${iso} composite`).toBeGreaterThanOrEqual(0);
      expect(data.composite, `${iso} composite`).toBeLessThanOrEqual(100);
    });
  });

  it("every entry has daily, industry and surveillance sub-scores", () => {
    Object.entries(AI_DATA).forEach(([iso, data]) => {
      expect(typeof data.daily,       `${iso} daily`).toBe("number");
      expect(typeof data.industry,    `${iso} industry`).toBe("number");
      expect(typeof data.surveillance,`${iso} surveillance`).toBe("number");
    });
  });

  it("composite equals the rounded mean of the three sub-scores", () => {
    Object.entries(AI_DATA).forEach(([iso, data]) => {
      const expected = Math.round(
        (data.daily + data.industry + data.surveillance) / 3
      );
      expect(data.composite, `${iso} composite calculation`).toBe(expected);
    });
  });

  it("every entry has a non-empty name string", () => {
    Object.entries(AI_DATA).forEach(([iso, data]) => {
      expect(typeof data.name, `${iso} name type`).toBe("string");
      expect(data.name.length, `${iso} name length`).toBeGreaterThan(0);
    });
  });

  it("every entry has noData === false", () => {
    Object.values(AI_DATA).forEach((data) => {
      expect(data.noData).toBe(false);
    });
  });

  it("uses correct ISO alpha-3 keys (3 uppercase letters)", () => {
    const pattern = /^[A-Z]{3}$/;
    Object.keys(AI_DATA).forEach((iso) => {
      expect(iso, `key "${iso}"`).toMatch(pattern);
    });
  });
});

// ── getCountryData ────────────────────────────────────────────────────────────

describe("getCountryData", () => {
  it("returns the entry for a known ISO code", () => {
    const data = getCountryData("USA");
    expect(data.name).toBe("United States");
    expect(data.noData).toBe(false);
    expect(data.composite).toBeGreaterThan(0);
  });

  it("returns a no-data placeholder for an unknown ISO code", () => {
    const data = getCountryData("ZZZ");
    expect(data.noData).toBe(true);
    expect(data.composite).toBeNull();
    expect(data.daily).toBeNull();
    expect(data.industry).toBeNull();
    expect(data.surveillance).toBeNull();
  });

  it("uses the fallback name when provided and ISO is unknown", () => {
    const data = getCountryData("ZZZ", "Mystery Land");
    expect(data.name).toBe("Mystery Land");
  });

  it("returns Somalia with a very low composite score", () => {
    const som = getCountryData("SOM");
    expect(som.composite).toBeLessThanOrEqual(10);
  });

  it("returns the USA with a high composite score", () => {
    const usa = getCountryData("USA");
    expect(usa.composite).toBeGreaterThanOrEqual(80);
  });
});

// ── getDefaultEntry ───────────────────────────────────────────────────────────

describe("getDefaultEntry", () => {
  it("returns an object with noData === true", () => {
    expect(getDefaultEntry().noData).toBe(true);
  });

  it("accepts a custom name", () => {
    expect(getDefaultEntry("Neverland").name).toBe("Neverland");
  });

  it("has null scores", () => {
    const d = getDefaultEntry();
    expect(d.composite).toBeNull();
    expect(d.daily).toBeNull();
    expect(d.industry).toBeNull();
    expect(d.surveillance).toBeNull();
  });
});

// ── getRankedCountries ────────────────────────────────────────────────────────

describe("getRankedCountries", () => {
  it("returns an array with the same length as AI_DATA", () => {
    expect(getRankedCountries().length).toBe(Object.keys(AI_DATA).length);
  });

  it("is sorted ascending by composite score", () => {
    const ranked = getRankedCountries();
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i].composite).toBeGreaterThanOrEqual(ranked[i - 1].composite);
    }
  });

  it("first entry is the country with the lowest composite score", () => {
    const ranked = getRankedCountries();
    const minScore = Math.min(...Object.values(AI_DATA).map((d) => d.composite));
    expect(ranked[0].composite).toBe(minScore);
  });

  it("every entry has an iso property", () => {
    getRankedCountries().forEach((entry) => {
      expect(typeof entry.iso).toBe("string");
      expect(entry.iso.length).toBe(3);
    });
  });
});

// ── getScoreLabel ─────────────────────────────────────────────────────────────

describe("getScoreLabel", () => {
  it('returns "No data" for null', () => {
    expect(getScoreLabel(null)).toBe("No data");
  });

  it("returns correct label for score 0", () => {
    expect(getScoreLabel(0)).toBe("Virtually no AI");
  });

  it("returns correct label for score 20 (boundary)", () => {
    expect(getScoreLabel(20)).toBe("Virtually no AI");
  });

  it("returns correct label for score 21 (next class)", () => {
    expect(getScoreLabel(21)).toBe("Low AI presence");
  });

  it("returns correct label for score 50", () => {
    expect(getScoreLabel(50)).toBe("Moderate AI presence");
  });

  it("returns correct label for score 75", () => {
    expect(getScoreLabel(75)).toBe("High AI presence");
  });

  it("returns correct label for score 100", () => {
    expect(getScoreLabel(100)).toBe("AI-saturated");
  });
});

// ── getScoreColor ─────────────────────────────────────────────────────────────

describe("getScoreColor", () => {
  it("returns a hex string for null (no-data colour)", () => {
    expect(getScoreColor(null)).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("returns green for score 10", () => {
    expect(getScoreColor(10)).toBe("#1a9641");
  });

  it("returns red for score 90", () => {
    expect(getScoreColor(90)).toBe("#d7191c");
  });

  it("returns a different colour than null-colour for score 0", () => {
    expect(getScoreColor(0)).not.toBe(getScoreColor(null));
  });
});
