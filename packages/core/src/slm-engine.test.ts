import { describe, it, expect, vi } from "vitest";
import { getTagColor, VALID_TAGS, TAG_COLORS, VaultKeepR_SLM } from "./slm-engine";

describe("getTagColor", () => {
  it("resolves known tags case-insensitively", () => {
    expect(getTagColor("banking")).toBe("#f59e0b");
    expect(getTagColor("CRYPTO")).toBe("#a855f7");
    expect(getTagColor("Dev")).toBe("#10b981");
  });

  it("falls back to gray for unknown tags", () => {
    expect(getTagColor("unknown-tag")).toBe("#94a3b8");
  });

  it("defines a color for every valid tag", () => {
    for (const tag of VALID_TAGS) {
      expect(TAG_COLORS[tag]).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});

describe("VaultKeepR_SLM.categorizeEntries", () => {
  const slm = new VaultKeepR_SLM();

  it("classifies entries by domain rules", async () => {
    const result = await slm.categorizeEntries([
      { id: "1", url: "https://www.paypal.com/login", username: "jane" },
      { id: "2", url: "github.com", username: "jane" },
      { id: "3", url: "https://mystery-site.tld", username: "jane" }
    ]);

    expect(result.tags["1"]).toContain("banking");
    expect(result.tags["2"]).toContain("dev");
    expect(result.tags["3"]).toEqual(["other"]);
  });

  it("caps tags at two per entry", async () => {
    const result = await slm.categorizeEntries([
      { id: "multi", url: "https://paypal-github-binance.example.com", username: "" }
    ]);
    expect(result.tags["multi"]).toHaveLength(2);
  });

  it("falls back to the raw url when it is not parseable", async () => {
    const result = await slm.categorizeEntries([
      { id: "bad", url: "https://", username: "" }
    ]);
    expect(result.tags["bad"]).toEqual(["other"]);
  });

  it("reports progress per batch", async () => {
    const onProgress = vi.fn();
    const entries = Array.from({ length: 35 }, (_, i) => ({
      id: `e${i}`,
      url: "https://example.com",
      username: ""
    }));
    await slm.categorizeEntries(entries, "en", onProgress);

    expect(onProgress).toHaveBeenCalledTimes(2);
    expect(onProgress).toHaveBeenNthCalledWith(1, 30, 35);
    expect(onProgress).toHaveBeenNthCalledWith(2, 35, 35);
  });
});

describe("VaultKeepR_SLM.summarizeBreach", () => {
  const slm = new VaultKeepR_SLM();

  it.each([
    [2, "low"],
    [10, "medium"],
    [100, "high"],
    [1000, "critical"]
  ] as const)("maps breachCount %i to severity %s", async (count, severity) => {
    const result = await slm.summarizeBreach(count, "https://example.com");
    expect(result.severity).toBe(severity);
    expect(result.riskType).toBe("Unauthorized access");
    expect(result.actions.length).toBeGreaterThan(0);
  });

  it("tailors the risk type to the domain", async () => {
    expect((await slm.summarizeBreach(10, "https://paypal.com")).riskType).toBe("Financial fraud");
    expect((await slm.summarizeBreach(10, "https://gmail.com")).riskType).toBe("Account takeover");
    expect((await slm.summarizeBreach(10, "https://coinbase.com")).riskType).toBe("Crypto theft");
    expect((await slm.summarizeBreach(10, "https://facebook.com")).riskType).toBe("Identity theft");
  });

  it("supports french output", async () => {
    const result = await slm.summarizeBreach(10, "https://gmail.com", "fr");
    expect(result.riskType).toBe("Prise de contrôle");
    expect(result.summary).toContain("fuites de données publiques");
  });

  it("handles missing and malformed site urls", async () => {
    const empty = await slm.summarizeBreach(1, "");
    expect(empty.riskType).toBe("Unauthorized access");

    const malformed = await slm.summarizeBreach(1, "::not-a-url::");
    expect(malformed.riskType).toBe("Unauthorized access");
  });
});
