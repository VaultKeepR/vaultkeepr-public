import { describe, it, expect } from "vitest";
import {
  normalizeSignatureForKdf,
  deriveKeyFromPasswordAndSignatureArgon2,
  deriveKeyFromPasswordAndSignatureLegacy,
  deriveKeyFromPasswordArgon2,
  generateSaltArgon2 } from
"./kdf-argon2";

describe("KDF Argon2id", () => {
  describe("normalizeSignatureForKdf", () => {
    it("strips V byte from standard 130-char signature", () => {
      const sig =
      "a1b2c3d4e5f6" + "00".repeat(57) + "1b";
      const normalized = normalizeSignatureForKdf(sig);
      expect(normalized.length).toBe(128);
      expect(normalized).toBe(sig.slice(0, 128));
    });

    it("normalizes 0x-prefixed signatures", () => {
      const sig = "0x" + "a1".repeat(65);
      const normalized = normalizeSignatureForKdf(sig);
      expect(normalized.length).toBe(128);
      expect(normalized.startsWith("0x")).toBe(false);
    });

    it("returns as-is for non-standard lengths", () => {
      const short = "abcdef1234";
      expect(normalizeSignatureForKdf(short)).toBe(short);
    });

    it("returns empty for empty input", () => {
      expect(normalizeSignatureForKdf("")).toBe("");
    });
  });

  describe("deriveKeyFromPasswordArgon2", () => {
    it("derives a 32-byte key", () => {
      const salt = generateSaltArgon2();
      const key = deriveKeyFromPasswordArgon2("password", salt);
      expect(key.length).toBe(32);
    });

    it("same password + salt = same key (deterministic)", () => {
      const salt = generateSaltArgon2();
      const k1 = deriveKeyFromPasswordArgon2("test", salt);
      const k2 = deriveKeyFromPasswordArgon2("test", salt);
      expect(k1).toEqual(k2);
    });

    it("different passwords produce different keys", () => {
      const salt = generateSaltArgon2();
      const k1 = deriveKeyFromPasswordArgon2("pass1", salt);
      const k2 = deriveKeyFromPasswordArgon2("pass2", salt);
      expect(k1).not.toEqual(k2);
    });

    it("different salts produce different keys", () => {
      const salt1 = generateSaltArgon2();
      const salt2 = generateSaltArgon2();
      const k1 = deriveKeyFromPasswordArgon2("same", salt1);
      const k2 = deriveKeyFromPasswordArgon2("same", salt2);
      expect(k1).not.toEqual(k2);
    });
  });

  describe("deriveKeyFromPasswordAndSignatureArgon2", () => {
    it("derives a 32-byte key from password + signature", () => {
      const salt = generateSaltArgon2();
      const sig = "a".repeat(130);
      const key = deriveKeyFromPasswordAndSignatureArgon2("pwd", sig, salt);
      expect(key.length).toBe(32);
    });

    it("deterministic: same inputs = same key", () => {
      const salt = generateSaltArgon2();
      const sig = "b".repeat(130);
      const k1 = deriveKeyFromPasswordAndSignatureArgon2("pwd", sig, salt);
      const k2 = deriveKeyFromPasswordAndSignatureArgon2("pwd", sig, salt);
      expect(k1).toEqual(k2);
    });

    it("different signatures produce different keys", () => {
      const salt = generateSaltArgon2();
      const sig1 = "a".repeat(130);
      const sig2 = "b".repeat(130);
      const k1 = deriveKeyFromPasswordAndSignatureArgon2("pwd", sig1, salt);
      const k2 = deriveKeyFromPasswordAndSignatureArgon2("pwd", sig2, salt);
      expect(k1).not.toEqual(k2);
    });

    it("normalized vs full signature produce different keys (V-byte normalization matters)", () => {
      const salt = generateSaltArgon2();

      const fullSig = "a".repeat(128) + "1b";
      const k1 = deriveKeyFromPasswordAndSignatureArgon2("pwd", fullSig, salt);

      const k2 = deriveKeyFromPasswordAndSignatureLegacy("pwd", fullSig, salt);
      expect(k1).not.toEqual(k2);
    });
  });

  describe("deriveKeyFromPasswordAndSignatureLegacy", () => {
    it("derives a 32-byte key", () => {
      const salt = generateSaltArgon2();
      const sig = "c".repeat(130);
      const key = deriveKeyFromPasswordAndSignatureLegacy("pwd", sig, salt);
      expect(key.length).toBe(32);
    });

    it("throws on missing signature", () => {
      const salt = generateSaltArgon2();
      expect(() =>
      deriveKeyFromPasswordAndSignatureLegacy("pwd", "", salt)
      ).toThrow("manquante");
    });

    it("handles 0x-prefixed signature", () => {
      const salt = generateSaltArgon2();
      const sig = "0x" + "d".repeat(128);
      const key = deriveKeyFromPasswordAndSignatureLegacy("pwd", sig, salt);
      expect(key.length).toBe(32);
    });
  });
});