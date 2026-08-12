import { describe, it, expect, beforeEach } from "vitest";
import {
  getHiddenWalletFromPassword,
  getHiddenWalletLegacy,
  clearHiddenWalletCache } from
"./hiddenWallet";

describe("Hidden wallet derivation", () => {
  beforeEach(() => {
    clearHiddenWalletCache();
  });

  describe("Legacy derivation (keccak256)", () => {
    it("derives a deterministic wallet address", () => {
      const account1 = getHiddenWalletLegacy("password123");
      const account2 = getHiddenWalletLegacy("password123");
      expect(account1.address).toBe(account2.address);
    });

    it("different passwords produce different addresses", () => {
      const a1 = getHiddenWalletLegacy("pass1");
      const a2 = getHiddenWalletLegacy("pass2");
      expect(a1.address).not.toBe(a2.address);
    });

    it("secretKey influences the derived address", () => {
      const a1 = getHiddenWalletLegacy("pass", "key1");
      const a2 = getHiddenWalletLegacy("pass", "key2");
      expect(a1.address).not.toBe(a2.address);
    });

    it("returns a valid Ethereum address", () => {
      const account = getHiddenWalletLegacy("test");
      expect(account.address).toMatch(/^0x[0-9a-fA-F]{40}$/);
    });
  });

  describe("Argon2id derivation (v2)", () => {
    it("derives a deterministic wallet address", async () => {
      const a1 = await getHiddenWalletFromPassword("masterpass", "secretkey");
      const a2 = await getHiddenWalletFromPassword("masterpass", "secretkey");
      expect(a1.address).toBe(a2.address);
    });

    it("different passwords produce different addresses", async () => {
      const a1 = await getHiddenWalletFromPassword("pass1", "key");
      const a2 = await getHiddenWalletFromPassword("pass2", "key");
      expect(a1.address).not.toBe(a2.address);
    });

    it("different secretKeys produce different addresses", async () => {
      const a1 = await getHiddenWalletFromPassword("pass", "key1");
      const a2 = await getHiddenWalletFromPassword("pass", "key2");
      expect(a1.address).not.toBe(a2.address);
    });

    it("without secretKey falls back to legacy", async () => {
      const v2 = await getHiddenWalletFromPassword("pass", "key");
      const legacy = getHiddenWalletLegacy("pass");

      expect(v2.address).not.toBe(legacy.address);
    });

    it("cache returns same object for same inputs", async () => {
      const a1 = await getHiddenWalletFromPassword("pass", "key");
      const a2 = await getHiddenWalletFromPassword("pass", "key");

      expect(a1).toBe(a2);
    });

    it("cache is cleared after clearHiddenWalletCache()", async () => {
      const a1 = await getHiddenWalletFromPassword("pass", "key");
      clearHiddenWalletCache();
      const a2 = await getHiddenWalletFromPassword("pass", "key");

      expect(a1).not.toBe(a2);
      expect(a1.address).toBe(a2.address);
    });
  });
});