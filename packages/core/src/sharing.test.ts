import { describe, it, expect } from "vitest";
import {
  createSecureShare,
  decryptSecureShare,
  generateSharePin,
  computeApiPinHash,
  buildShareUrl,
  parseShareUrl,
  ttlToMs } from
"./sharing";

describe("Zero-knowledge secure sharing", () => {
  describe("createSecureShare / decryptSecureShare roundtrip", () => {
    it("roundtrips credential share with auto-generated PIN", () => {
      const result = createSecureShare({
        type: "credentials",
        username: "user@example.com",
        password: "s3cretP@ss",
        url: "https://example.com"
      });

      const decrypted = decryptSecureShare(
        result.encryptedBlob,
        result.privateKeyHex,
        result.pin
      );

      expect(decrypted.type).toBe("credentials");
      expect(decrypted.username).toBe("user@example.com");
      expect(decrypted.password).toBe("s3cretP@ss");
      expect(decrypted.version).toBe(2);
    });

    it("roundtrips with custom PIN", () => {
      const result = createSecureShare(
        {
          type: "note",
          noteTitle: "Secret Note",
          noteContent: "Important data"
        },
        "123456"
      );

      const decrypted = decryptSecureShare(
        result.encryptedBlob,
        result.privateKeyHex,
        "123456"
      );

      expect(decrypted.noteTitle).toBe("Secret Note");
      expect(decrypted.noteContent).toBe("Important data");
    });

    it("roundtrips file share", () => {
      const result = createSecureShare({
        type: "file",
        fileName: "doc.pdf",
        fileMimeType: "application/pdf",
        fileData: "base64encodeddata",
        fileSize: 1024
      });

      const decrypted = decryptSecureShare(
        result.encryptedBlob,
        result.privateKeyHex,
        result.pin
      );

      expect(decrypted.fileName).toBe("doc.pdf");
      expect(decrypted.fileData).toBe("base64encodeddata");
    });

    it("roundtrips link share", () => {
      const result = createSecureShare({
        type: "link",
        linkUrl: "https://secret.example.com/doc",
        linkTitle: "Secret Doc"
      });

      const decrypted = decryptSecureShare(
        result.encryptedBlob,
        result.privateKeyHex,
        result.pin
      );

      expect(decrypted.linkUrl).toBe("https://secret.example.com/doc");
    });

    it("includes createdAt timestamp", () => {
      const before = Date.now();
      const result = createSecureShare({
        type: "credentials",
        username: "u",
        password: "p"
      });
      const after = Date.now();

      const decrypted = decryptSecureShare(
        result.encryptedBlob,
        result.privateKeyHex,
        result.pin
      );

      expect(decrypted.createdAt).toBeGreaterThanOrEqual(before);
      expect(decrypted.createdAt).toBeLessThanOrEqual(after);
    });
  });

  describe("Wrong PIN", () => {
    it("throws with wrong PIN", () => {
      const result = createSecureShare(
        { type: "credentials", username: "u", password: "p" },
        "111111"
      );

      expect(() =>
      decryptSecureShare(result.encryptedBlob, result.privateKeyHex, "999999")
      ).toThrow("Invalid PIN");
    });
  });

  describe("PIN generation", () => {
    it("generates 6-digit PINs", () => {
      const pin = generateSharePin();
      expect(pin.length).toBe(6);
      expect(/^\d{6}$/.test(pin)).toBe(true);
    });

    it("generates different PINs", () => {
      const pins = new Set(Array.from({ length: 20 }, () => generateSharePin()));
      expect(pins.size).toBeGreaterThan(1);
    });
  });

  describe("API PIN hash", () => {
    it("produces SHA-256 hex of PIN", () => {
      const hash = computeApiPinHash("123456");
      expect(hash.length).toBe(64);
    });

    it("deterministic: same PIN = same hash", () => {
      expect(computeApiPinHash("123456")).toBe(computeApiPinHash("123456"));
    });
  });

  describe("URL utilities", () => {
    it("buildShareUrl puts key in fragment", () => {
      const url = buildShareUrl("https://app.vaultkeepr.com", "abc123", "deadbeef");
      expect(url).toBe("https://app.vaultkeepr.com/share/abc123#deadbeef");
    });

    it("parseShareUrl extracts shareId and key from fragment", () => {
      const parsed = parseShareUrl("https://app.vaultkeepr.com/share/abc123#deadbeef");
      expect(parsed).toEqual({ shareId: "abc123", publicKeyHex: "deadbeef" });
    });

    it("parseShareUrl returns null for invalid URL", () => {
      expect(parseShareUrl("not-a-url")).toBeNull();
    });

    it("parseShareUrl returns null for missing share path", () => {
      expect(parseShareUrl("https://app.vaultkeepr.com/other")).toBeNull();
    });
  });

  describe("TTL conversion", () => {
    it("converts 1h to 3600000ms", () => {
      expect(ttlToMs("1h")).toBe(3600000);
    });

    it("converts 24h to 86400000ms", () => {
      expect(ttlToMs("24h")).toBe(86400000);
    });

    it("converts 7d to 604800000ms", () => {
      expect(ttlToMs("7d")).toBe(604800000);
    });
  });

  describe("Payload size limit", () => {
    it("rejects oversized payloads", () => {
      const hugePayload = {
        type: "file" as const,
        fileName: "big.pdf",
        fileMimeType: "application/pdf",
        fileData: "x".repeat(8 * 1024 * 1024),
        fileSize: 8 * 1024 * 1024
      };

      expect(() => createSecureShare(hugePayload)).toThrow("too large");
    });
  });
});