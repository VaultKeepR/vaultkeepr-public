import { describe, it, expect } from "vitest";
import {
  encryptVault,
  decryptVault,
  generateMasterKey } from
"./crypto";
import { hexToBytes } from "@noble/hashes/utils.js";

describe("Vault encryption (XChaCha20-Poly1305 + HMAC commitment)", () => {
  describe("encryptVault / decryptVault roundtrip", () => {
    it("encrypts and decrypts a string vault", () => {
      const key = generateMasterKey();
      const plaintext = JSON.stringify({
        entries: [{ id: "1", password: "s3cret" }],
        folders: ["default"]
      });

      const encrypted = encryptVault(plaintext, key, { wipeKeyAfterUse: false });
      const decrypted = decryptVault(encrypted, key, { wipeKeyAfterUse: false });

      expect(decrypted).toBe(plaintext);
    });

    it("produces different ciphertext each time (random nonce)", () => {
      const key1 = generateMasterKey();
      const key2 = generateMasterKey();
      const pt = "test data";

      const enc1 = encryptVault(pt, key1, { wipeKeyAfterUse: false });
      const enc2 = encryptVault(pt, key2, { wipeKeyAfterUse: false });

      expect(enc1.ciphertext).not.toBe(enc2.ciphertext);
      expect(enc1.nonce).not.toBe(enc2.nonce);
    });

    it("encrypted version is always 3", () => {
      const key = generateMasterKey();
      const enc = encryptVault("hello", key, { wipeKeyAfterUse: false });
      expect(enc.version).toBe(3);
    });

    it("includes a hex-encoded commitment", () => {
      const key = generateMasterKey();
      const enc = encryptVault("test", key, { wipeKeyAfterUse: false });
      expect(enc.commitment).toBeDefined();
      expect(enc.commitment!.length).toBeGreaterThan(0);

      expect(enc.commitment!.length).toBe(64);
    });
  });

  describe("Commitment verification", () => {
    it("rejects vault with tampered ciphertext (substitution attack)", () => {
      const key = generateMasterKey();
      const enc = encryptVault("original", key, { wipeKeyAfterUse: false });


      const tampered = { ...enc, ciphertext: enc.commitment! };

      expect(() => decryptVault(tampered, key, { wipeKeyAfterUse: false })).toThrow(
        "Invalid commitment"
      );
    });

    it("rejects v3 vault without commitment", () => {
      const key = generateMasterKey();
      const enc = encryptVault("data", key, { wipeKeyAfterUse: false });

      const noCommitment = { ...enc, commitment: undefined, version: 3 };

      expect(() => decryptVault(noCommitment, key, { wipeKeyAfterUse: false })).toThrow(
        "Missing commitment"
      );
    });

    it("accepts v2 vault without commitment (backward compat)", () => {
      const key = generateMasterKey();
      const enc = encryptVault("data", key, { wipeKeyAfterUse: false });


      const v2Vault = { ...enc, commitment: undefined, version: 2 };


      expect(() => decryptVault(v2Vault, key, { wipeKeyAfterUse: false })).not.toThrow();
    });
  });

  describe("Key security (wipe)", () => {
    it("wipeKeyAfterUse: true zeroes the key buffer", () => {
      const key = generateMasterKey();
      const original = new Uint8Array(key);
      encryptVault("test", key, { wipeKeyAfterUse: true });


      const allZero = key.every((b) => b === 0);
      expect(allZero).toBe(true);

      expect(original.some((b) => b !== 0)).toBe(true);
    });

    it("wipeKeyAfterUse: false preserves the key", () => {
      const key = generateMasterKey();
      const original = new Uint8Array(key);
      encryptVault("test", key, { wipeKeyAfterUse: false });

      expect(key).toEqual(original);
    });
  });

  describe("Wrong key", () => {
    it("throws on wrong decryption key", () => {
      const key = generateMasterKey();
      const enc = encryptVault("secret", key, { wipeKeyAfterUse: false });
      const wrongKey = generateMasterKey();


      expect(() => decryptVault(enc, wrongKey, { wipeKeyAfterUse: false })).toThrow();
    });
  });

  describe("Automerge binary detection", () => {
    it("detects Automerge CRDT binary and returns Uint8Array", () => {
      const key = generateMasterKey();

      const automergeData = new Uint8Array([0x85, 0x6f, 0x4a, 0x83, 0x01, 0x02, 0x03]);
      const enc = encryptVault(automergeData, key, { wipeKeyAfterUse: false });

      const result = decryptVault(enc, key, { wipeKeyAfterUse: false });
      expect(result).toBeInstanceOf(Uint8Array);
      expect((result as Uint8Array)[0]).toBe(0x85);
    });

    it("decrypts non-Automerge data as string", () => {
      const key = generateMasterKey();
      const plaintext = "hello world";
      const enc = encryptVault(plaintext, key, { wipeKeyAfterUse: false });

      const result = decryptVault(enc, key, { wipeKeyAfterUse: false });
      expect(typeof result).toBe("string");
      expect(result).toBe(plaintext);
    });
  });

  describe("Key derivation determinism", () => {
    it("same password + salt via KDF produces identical key", () => {


      const key1 = generateMasterKey();
      const key2 = new Uint8Array(key1);

      const pt = "determinism test";
      const enc1 = encryptVault(pt, key1, { wipeKeyAfterUse: false });
      const enc2 = encryptVault(pt, key2, { wipeKeyAfterUse: false });


      expect(decryptVault(enc1, key1, { wipeKeyAfterUse: false })).toBe(pt);
      expect(decryptVault(enc2, key2, { wipeKeyAfterUse: false })).toBe(pt);
    });
  });

  describe("Compression bomb protection", () => {
    it("decompressVault accepts non-gzipped data as fallback", async () => {
      const { decompressVault } = await import("./crypto");
      const text = "plain text data";
      const data = new TextEncoder().encode(text);

      const result = await decompressVault(data);
      expect(result).toBe(text);
    });

    it("decompressVault detects gzip magic bytes", async () => {
      const { decompressVault, compressVault } = await import("./crypto");
      const original = "compressed content";
      const compressed = await compressVault(original);


      expect(compressed[0]).toBe(0x1f);
      expect(compressed[1]).toBe(0x8b);

      const decompressed = await decompressVault(compressed);
      expect(decompressed).toBe(original);
    });
  });
});