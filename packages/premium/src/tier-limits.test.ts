import { describe, it, expect } from "vitest";
import {
  getCloudQuotaForTier,
  getMaxFileSizeForTier,
  getMaxSecureDocumentsForTier,
  parseTier,
  isPremiumUntilValid,
  type PremiumTier } from
"./index";

describe("Premium tier limits enforcement", () => {
  describe("Cloud quotas", () => {
    it("free tier: 10 MB", () => {
      expect(getCloudQuotaForTier("free")).toBe(10 * 1024 * 1024);
    });

    it("premium tier: 1 GB", () => {
      expect(getCloudQuotaForTier("premium")).toBe(1024 * 1024 * 1024);
    });

    it("cloud_pro tier: 50 GB", () => {
      expect(getCloudQuotaForTier("cloud_pro")).toBe(50 * 1024 * 1024 * 1024);
    });

    it("ultimate tier: 500 GB", () => {
      expect(getCloudQuotaForTier("ultimate")).toBe(500 * 1024 * 1024 * 1024);
    });

    it("free tier quota < premium tier quota", () => {
      expect(getCloudQuotaForTier("free")).toBeLessThan(getCloudQuotaForTier("premium"));
    });

    it("premium tier quota < cloud_pro tier quota", () => {
      expect(getCloudQuotaForTier("premium")).toBeLessThan(getCloudQuotaForTier("cloud_pro"));
    });
  });

  describe("Max file sizes", () => {
    it("free: 5 MB", () => {
      expect(getMaxFileSizeForTier("free")).toBe(5 * 1024 * 1024);
    });

    it("premium: 25 MB", () => {
      expect(getMaxFileSizeForTier("premium")).toBe(25 * 1024 * 1024);
    });

    it("ultimate: 50 MB", () => {
      expect(getMaxFileSizeForTier("ultimate")).toBe(50 * 1024 * 1024);
    });

    it("free max file size < premium max file size", () => {
      expect(getMaxFileSizeForTier("free")).toBeLessThan(getMaxFileSizeForTier("premium"));
    });
  });

  describe("Max secure documents", () => {
    it("free: 1", () => {
      expect(getMaxSecureDocumentsForTier("free")).toBe(1);
    });

    it("premium: 2", () => {
      expect(getMaxSecureDocumentsForTier("premium")).toBe(2);
    });

    it("cloud_pro: 5", () => {
      expect(getMaxSecureDocumentsForTier("cloud_pro")).toBe(5);
    });

    it("ultimate: unlimited (99999)", () => {
      expect(getMaxSecureDocumentsForTier("ultimate")).toBe(99999);
    });

    it("free limit < premium limit", () => {
      expect(getMaxSecureDocumentsForTier("free")).toBeLessThan(
        getMaxSecureDocumentsForTier("premium")
      );
    });
  });

  describe("parseTier", () => {
    it("parses valid tiers", () => {
      expect(parseTier("free")).toBe("free");
      expect(parseTier("premium")).toBe("premium");
      expect(parseTier("cloud_pro")).toBe("cloud_pro");
      expect(parseTier("ultimate")).toBe("ultimate");
    });

    it("defaults unknown to free", () => {
      expect(parseTier("unknown")).toBe("free");
      expect(parseTier(null)).toBe("free");
      expect(parseTier(undefined)).toBe("free");
      expect(parseTier("")).toBe("free");
    });
  });

  describe("isPremiumUntilValid", () => {
    it("future date is valid", () => {
      const future = new Date(Date.now() + 86400000).toISOString();
      expect(isPremiumUntilValid(future)).toBe(true);
    });

    it("past date is invalid", () => {
      const past = new Date(Date.now() - 86400000).toISOString();
      expect(isPremiumUntilValid(past)).toBe(false);
    });

    it("null is invalid", () => {
      expect(isPremiumUntilValid(null)).toBe(false);
    });

    it("undefined is invalid", () => {
      expect(isPremiumUntilValid(undefined)).toBe(false);
    });

    it("invalid date string is invalid", () => {
      expect(isPremiumUntilValid("not-a-date")).toBe(false);
    });
  });
});