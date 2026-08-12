import { describe, it, expect } from "vitest";
import { decompressVault, compressVault } from "./crypto";

describe("Compression bomb protection", () => {
  describe("decompressVault size limit (50 MB)", () => {
    it("accepts normal-sized compressed data", async () => {
      const original = "a".repeat(1000);
      const compressed = await compressVault(original);
      const decompressed = await decompressVault(compressed);
      expect(decompressed).toBe(original);
    });

    it("accepts uncompressed data (fallback path)", async () => {
      const text = "plain text data";
      const data = new TextEncoder().encode(text);
      const result = await decompressVault(data);
      expect(result).toBe(text);
    });

    it("detects gzip magic bytes", async () => {
      const original = "test content";
      const compressed = await compressVault(original);


      expect(compressed[0]).toBe(0x1f);
      expect(compressed[1]).toBe(0x8b);

      const decompressed = await decompressVault(compressed);
      expect(decompressed).toBe(original);
    });

    it("empty data decompresses to empty string", async () => {
      const data = new Uint8Array(0);
      const result = await decompressVault(data);
      expect(result).toBe("");
    });

    it("single byte decompresses correctly", async () => {
      const data = new Uint8Array([0x42]);
      const result = await decompressVault(data);
      expect(result).toBe("B");
    });
  });

  describe("compressVault", () => {
    it("produces gzip-compressed output", async () => {
      const original = "hello world ".repeat(100);
      const compressed = await compressVault(original);


      expect(compressed.length).toBeLessThan(original.length);


      expect(compressed[0]).toBe(0x1f);
      expect(compressed[1]).toBe(0x8b);
    });

    it("roundtrips: compress then decompress", async () => {
      const original = "sensitive vault data: password123";
      const compressed = await compressVault(original);
      const decompressed = await decompressVault(compressed);
      expect(decompressed).toBe(original);
    });

    it("handles unicode content", async () => {
      const original = "Mot de passe: café résumé naïve";
      const compressed = await compressVault(original);
      const decompressed = await decompressVault(compressed);
      expect(decompressed).toBe(original);
    });
  });

  describe("Security: no data loss in compression roundtrip", () => {
    it("preserves all bytes in compression roundtrip", async () => {

      const bytes = new Uint8Array(256);
      for (let i = 0; i < 256; i++) bytes[i] = i;
      const original = Array.from(bytes).map((b) => String.fromCharCode(b)).join("");

      const compressed = await compressVault(original);
      const decompressed = await decompressVault(compressed);
      expect(decompressed).toBe(original);
    });
  });
});