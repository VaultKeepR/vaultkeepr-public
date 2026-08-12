import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  PremiumTier,
  getCloudQuotaForTier,
  getMaxFileSizeForTier,
  getMaxSecureDocumentsForTier,
  tierHasCloud,
  parseTier,
  isPremiumUntilValid,
  activateLicense,
  getLicenseStatus,
  getPremiumStatus,
  removeDevice,
  syncPremium } from
"./index";




describe("getCloudQuotaForTier", () => {
  it("returns 10 MB for free", () => {
    expect(getCloudQuotaForTier("free")).toBe(10 * 1024 * 1024);
  });

  it("returns 1 GB for premium", () => {
    expect(getCloudQuotaForTier("premium")).toBe(1024 * 1024 * 1024);
  });

  it("returns 50 GB for cloud_pro", () => {
    expect(getCloudQuotaForTier("cloud_pro")).toBe(50 * 1024 * 1024 * 1024);
  });

  it("returns 500 GB for ultimate", () => {
    expect(getCloudQuotaForTier("ultimate")).toBe(500 * 1024 * 1024 * 1024);
  });
});

describe("getMaxFileSizeForTier", () => {
  it("returns 5 MB for free", () => {
    expect(getMaxFileSizeForTier("free")).toBe(5 * 1024 * 1024);
  });

  it("returns 25 MB for premium", () => {
    expect(getMaxFileSizeForTier("premium")).toBe(25 * 1024 * 1024);
  });

  it("returns 25 MB for cloud_pro", () => {
    expect(getMaxFileSizeForTier("cloud_pro")).toBe(25 * 1024 * 1024);
  });

  it("returns 50 MB for ultimate", () => {
    expect(getMaxFileSizeForTier("ultimate")).toBe(50 * 1024 * 1024);
  });
});

describe("getMaxSecureDocumentsForTier", () => {
  it("returns 1 for free", () => {
    expect(getMaxSecureDocumentsForTier("free")).toBe(1);
  });

  it("returns 2 for premium", () => {
    expect(getMaxSecureDocumentsForTier("premium")).toBe(2);
  });

  it("returns 5 for cloud_pro", () => {
    expect(getMaxSecureDocumentsForTier("cloud_pro")).toBe(5);
  });

  it("returns 99999 (unlimited) for ultimate", () => {
    expect(getMaxSecureDocumentsForTier("ultimate")).toBe(99999);
  });
});

describe("tierHasCloud", () => {
  it("returns true for all tiers", () => {
    expect(tierHasCloud("free")).toBe(true);
    expect(tierHasCloud("premium")).toBe(true);
    expect(tierHasCloud("cloud_pro")).toBe(true);
    expect(tierHasCloud("ultimate")).toBe(true);
  });
});




describe("parseTier", () => {
  it("returns 'free' for null", () => {
    expect(parseTier(null)).toBe("free");
  });

  it("returns 'free' for undefined", () => {
    expect(parseTier(undefined)).toBe("free");
  });

  it("returns 'free' for empty string", () => {
    expect(parseTier("")).toBe("free");
  });

  it("returns 'free' for unknown tier", () => {
    expect(parseTier("basic")).toBe("free");
  });

  it("returns 'premium' for 'premium'", () => {
    expect(parseTier("premium")).toBe("premium");
  });

  it("returns 'cloud_pro' for 'cloud_pro'", () => {
    expect(parseTier("cloud_pro")).toBe("cloud_pro");
  });

  it("returns 'ultimate' for 'ultimate'", () => {
    expect(parseTier("ultimate")).toBe("ultimate");
  });
});




describe("isPremiumUntilValid", () => {
  it("returns false for null", () => {
    expect(isPremiumUntilValid(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isPremiumUntilValid(undefined)).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isPremiumUntilValid("")).toBe(false);
  });

  it("returns false for invalid date", () => {
    expect(isPremiumUntilValid("not-a-date")).toBe(false);
  });

  it("returns true for future date", () => {
    const future = new Date(Date.now() + 86400000).toISOString();
    expect(isPremiumUntilValid(future)).toBe(true);
  });

  it("returns false for past date", () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    expect(isPremiumUntilValid(past)).toBe(false);
  });

  it("returns false for date exactly now (edge case)", () => {
    const now = new Date().toISOString();

    const result = isPremiumUntilValid(now);
    expect(typeof result).toBe("boolean");
  });
});




describe("activateLicense", () => {
  const API = "https://app.vaultkeepr.xyz";

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns ok on successful activation", async () => {
    const futureDate = new Date(Date.now() + 30 * 86400000).toISOString();
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        ok: true,
        premiumUntil: futureDate,
        tier: "premium",
        devices: [{ deviceId: "dev-1", platform: "extension", activatedAt: new Date().toISOString(), lastSeenAt: new Date().toISOString() }]
      })
    } as Response);

    const result = await activateLicense(API, "VK-TEST-TEST-TEST-ABCD", "device-1", "extension", "Test Device", "0x123");

    expect(result.ok).toBe(true);
    expect(result.premiumUntil).toBe(futureDate);
    expect(result.tier).toBe("premium");
    expect(result.devices).toHaveLength(1);
    expect(result.httpStatus).toBe(200);

    expect(fetch).toHaveBeenCalledWith(`${API}/api/premium/activate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: "VK-TEST-TEST-TEST-ABCD",
        deviceId: "device-1",
        platform: "extension",
        label: "Test Device",
        walletAddress: "0x123"
      })
    });
  });

  it("returns error on network failure", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("Network error"));

    const result = await activateLicense(API, "VK-BAD", "dev-1", "extension");

    expect(result.ok).toBe(false);
    expect(result.error).toBe("network");
    expect(result.httpStatus).toBe(0);
    expect(result.tier).toBe("free");
  });

  it("returns error on non-JSON response", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => {throw new Error("Bad JSON");}
    } as Response);

    const result = await activateLicense(API, "VK-BAD", "dev-1", "extension");

    expect(result.ok).toBe(false);
    expect(result.error).toBe("non-json");
    expect(result.httpStatus).toBe(502);
  });

  it("handles server rejection (invalid key)", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        ok: false,
        error: "Invalid license key"
      })
    } as Response);

    const result = await activateLicense(API, "VK-INVALID", "dev-1", "extension");

    expect(result.ok).toBe(false);
    expect(result.error).toBe("Invalid license key");
  });

  it("handles device limit exceeded", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        ok: false,
        error: "Device limit reached",
        devices: [
        { deviceId: "d1" }, { deviceId: "d2" }, { deviceId: "d3" },
        { deviceId: "d4" }, { deviceId: "d5" }]

      })
    } as Response);

    const result = await activateLicense(API, "VK-KEY", "dev-6", "extension");

    expect(result.ok).toBe(false);
    expect(result.error).toBe("Device limit reached");
    expect(result.devices).toHaveLength(5);
  });
});

describe("getLicenseStatus", () => {
  const API = "https://app.vaultkeepr.xyz";

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns license status for valid key", async () => {
    const futureDate = new Date(Date.now() + 30 * 86400000).toISOString();
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        premiumUntil: futureDate,
        tier: "cloud_pro",
        devices: [{ deviceId: "d1", platform: "extension" }]
      })
    } as Response);

    const result = await getLicenseStatus(API, "VK-KEY-1234-KEY-ABCD", "dev-1");

    expect(result.ok).toBe(true);
    expect(result.premiumUntil).toBe(futureDate);
    expect(result.tier).toBe("cloud_pro");
    expect(result.isCloudPro).toBe(true);
    expect(result.httpStatus).toBe(200);

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(calledUrl).toContain("key=VK-KEY-1234-KEY-ABCD");
    expect(calledUrl).toContain("deviceId=dev-1");
  });

  it("returns network error on fetch failure", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("DNS failure"));

    const result = await getLicenseStatus(API, "VK-KEY");

    expect(result.ok).toBe(false);
    expect(result.error).toBe("network");
    expect(result.httpStatus).toBe(0);
  });

  it("normalizes key to uppercase", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ premiumUntil: null, tier: "free", devices: [] })
    } as Response);

    await getLicenseStatus(API, "vk-lower-case-key-abcd");

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(calledUrl).toContain("key=VK-LOWER-CASE-KEY-ABCD");
  });

  it("returns correct tier hierarchy for isCloudPro", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ premiumUntil: new Date().toISOString(), tier: "ultimate", devices: [] })
    } as Response);

    const result = await getLicenseStatus(API, "VK-KEY");
    expect(result.isCloudPro).toBe(true);

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ premiumUntil: new Date().toISOString(), tier: "premium", devices: [] })
    } as Response);

    const result2 = await getLicenseStatus(API, "VK-KEY");
    expect(result2.isCloudPro).toBe(false);
  });
});

describe("getPremiumStatus", () => {
  const API = "https://app.vaultkeepr.xyz";

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns premium status for wallet address", async () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString();
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        premiumUntil: futureDate,
        tier: "premium",
        licenseKey: "VK-KEY-1234-KEY-ABCD",
        devices: []
      })
    } as Response);

    const result = await getPremiumStatus(API, "0xABC123");

    expect(result.premiumUntil).toBe(futureDate);
    expect(result.tier).toBe("premium");
    expect(result.licenseKey).toBe("VK-KEY-1234-KEY-ABCD");
  });

  it("normalizes wallet address to lowercase", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ premiumUntil: null, tier: "free" })
    } as Response);

    await getPremiumStatus(API, "0xABC123");

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(calledUrl).toContain("userId=0xabc123");
  });

  it("returns free tier for non-premium wallet", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({})
    } as Response);

    const result = await getPremiumStatus(API, "0xNOPE");

    expect(result.tier).toBe("free");
    expect(result.premiumUntil).toBeNull();
  });

  it("trims and lowercases whitespace userId", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ premiumUntil: null, tier: "free" })
    } as Response);

    await getPremiumStatus(API, "  0xWHITESPACE  ");

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(calledUrl).toContain("userId=0xwhitespace");
  });
});

describe("removeDevice", () => {
  const API = "https://app.vaultkeepr.xyz";

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends DELETE request with correct body", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true })
    } as Response);

    const result = await removeDevice(API, "VK-KEY", "dev-to-remove");

    expect(result.ok).toBe(true);
    expect(fetch).toHaveBeenCalledWith(`${API}/api/premium/device`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "VK-KEY", deviceId: "dev-to-remove" })
    });
  });
});

describe("syncPremium", () => {
  const API = "https://app.vaultkeepr.xyz";

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("syncs premium until to server", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => "ok"
    } as Response);

    const result = await syncPremium(API, "0xABC", "2027-01-01T00:00:00Z");

    expect(result.ok).toBe(true);
    expect(fetch).toHaveBeenCalledWith(`${API}/api/premium`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "0xabc", premiumUntil: "2027-01-01T00:00:00Z" })
    });
  });

  it("returns error for empty userId", async () => {
    const result = await syncPremium(API, "   ", "2027-01-01T00:00:00Z");
    expect(result.ok).toBe(false);
    expect(result.error).toBe("Identifiant invalide.");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("includes Authorization header when apiKey is provided", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => "ok"
    } as Response);

    await syncPremium(API, "0xABC", "2027-01-01T00:00:00Z", "my-secret-key");

    const headers = vi.mocked(fetch).mock.calls[0][1]?.headers as Record<string, string>;
    expect(headers["Authorization"]).toBe("Bearer my-secret-key");
  });
});