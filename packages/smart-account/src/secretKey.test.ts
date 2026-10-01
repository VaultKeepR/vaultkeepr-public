import { afterEach, describe, expect, it } from "vitest";
import {
  formatSecretKeyForDisplay,
  generateSecretKey,
  isValidSecretKey,
  parseSecretKeyInput
} from "./secretKey";

const originalCrypto = globalThis.crypto;

describe("generateSecretKey", () => {
  afterEach(() => {
    Object.defineProperty(globalThis, "crypto", {
      value: originalCrypto,
      configurable: true
    });
  });

  it("produces a 64-hex-char key from the CSPRNG", () => {
    expect(isValidSecretKey(generateSecretKey())).toBe(true);
  });

  it("refuses to degrade to Math.random when WebCrypto is unavailable", () => {
    Object.defineProperty(globalThis, "crypto", {
      value: undefined,
      configurable: true
    });
    expect(() => generateSecretKey()).toThrow(/CSPRNG indisponible/);
  });
});

describe("secretKey helpers", () => {
  const key = "a".repeat(64);

  it("validates 256-bit hex keys", () => {
    expect(isValidSecretKey(key)).toBe(true);
    expect(isValidSecretKey("0x" + key)).toBe(false);
    expect(isValidSecretKey(key.slice(1))).toBe(false);
  });

  it("round-trips display formatting", () => {
    expect(parseSecretKeyInput(formatSecretKeyForDisplay(key))).toBe(key);
  });
});
