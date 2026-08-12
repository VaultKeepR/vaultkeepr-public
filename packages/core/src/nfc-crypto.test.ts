import { describe, it, expect } from "vitest";
import {
  encryptNfcPayload,
  decryptNfcPayload,
  generateNfcDeviceSecret,
  isNfcPayloadV1,
  isNfcPayloadV2,
  isNfcPayloadV3 } from
"./nfc-crypto";

describe("NFC payload encryption (XChaCha20-Poly1305)", () => {
  describe("encrypt/decrypt roundtrip", () => {
    it("roundtrips a short text password", () => {
      const secret = generateNfcDeviceSecret();
      const pin = "1234";
      const password = "MyVaultP@ssw0rd!";

      const payload = encryptNfcPayload(password, secret, pin);
      const decrypted = decryptNfcPayload(payload, secret, pin);

      expect(decrypted).toBe(password);
    });

    it("roundtrips a long hex password (32+ chars)", () => {
      const secret = generateNfcDeviceSecret();
      const pin = "5678";
      const hexPassword = "a".repeat(64);

      const payload = encryptNfcPayload(hexPassword, secret, pin);
      const decrypted = decryptNfcPayload(payload, secret, pin);

      expect(decrypted).toBe(hexPassword);
    });

    it("roundtrips a short hex password (< 32 chars)", () => {
      const secret = generateNfcDeviceSecret();
      const pin = "9999";
      const hexPassword = "abcdef1234567890";

      const payload = encryptNfcPayload(hexPassword, secret, pin);
      const decrypted = decryptNfcPayload(payload, secret, pin);

      expect(decrypted).toBe(hexPassword);
    });

    it("roundtrips empty password edge case", () => {
      const secret = generateNfcDeviceSecret();
      const pin = "0000";

      const payload = encryptNfcPayload("", secret, pin);
      const decrypted = decryptNfcPayload(payload, secret, pin);

      expect(decrypted).toBe("");
    });
  });

  describe("Format selection", () => {
    it("uses v2 format for short passwords", () => {
      const secret = generateNfcDeviceSecret();
      const payload = encryptNfcPayload("short", secret, "1234");

      expect(isNfcPayloadV2(payload)).toBe(true);
      expect(isNfcPayloadV3(payload)).toBe(false);
      expect(payload.startsWith("vk2:")).toBe(true);
    });

    it("uses v3 format for long passwords exceeding NTAG213 capacity", () => {
      const secret = generateNfcDeviceSecret();

      const longPassword = "A".repeat(200);

      const payload = encryptNfcPayload(longPassword, secret, "1234");

      expect(isNfcPayloadV3(payload)).toBe(true);
      expect(isNfcPayloadV2(payload)).toBe(false);
      expect(payload.startsWith("vk3:")).toBe(true);
    });
  });

  describe("Security: wrong key/PIN", () => {
    it("throws with wrong PIN", () => {
      const secret = generateNfcDeviceSecret();
      const payload = encryptNfcPayload("secret", secret, "1234");

      expect(() => decryptNfcPayload(payload, secret, "9999")).toThrow();
    });

    it("throws with wrong device secret", () => {
      const secret1 = generateNfcDeviceSecret();
      const secret2 = generateNfcDeviceSecret();
      const payload = encryptNfcPayload("secret", secret1, "1234");

      expect(() => decryptNfcPayload(payload, secret2, "1234")).toThrow();
    });

    it("throws with invalid payload format", () => {
      const secret = generateNfcDeviceSecret();

      expect(() => decryptNfcPayload("invalid", secret, "1234")).toThrow(
        "Invalid NFC payload format"
      );
    });
  });

  describe("Legacy v1 detection", () => {
    it("identifies v1 payloads", () => {
      expect(isNfcPayloadV1("vk1:somedata")).toBe(true);
      expect(isNfcPayloadV1("vk2:nonce:ct")).toBe(false);
      expect(isNfcPayloadV1("vk3:combined")).toBe(false);
      expect(isNfcPayloadV1("random")).toBe(false);
    });
  });

  describe("Device secret generation", () => {
    it("generates 32-byte secrets", () => {
      const secret = generateNfcDeviceSecret();
      expect(secret.length).toBe(32);
    });

    it("generates different secrets each time", () => {
      const s1 = generateNfcDeviceSecret();
      const s2 = generateNfcDeviceSecret();
      expect(s1).not.toEqual(s2);
    });
  });
});