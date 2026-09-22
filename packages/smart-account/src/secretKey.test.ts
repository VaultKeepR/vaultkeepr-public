import { describe, it, expect } from "vitest";
import { generateSecretKey, isValidSecretKey } from "./secretKey";

describe("smart-account — generateSecretKey", () => {
  it("returns 64 hex characters (256-bit key)", () => {
    const key = generateSecretKey();
    expect(key).toMatch(/^[0-9a-f]{64}$/);
  });

  it("produces distinct keys across calls", () => {
    const a = generateSecretKey();
    const b = generateSecretKey();
    expect(a).not.toBe(b);
  });

  it("output passes isValidSecretKey", () => {
    expect(isValidSecretKey(generateSecretKey())).toBe(true);
  });

  it("throws instead of degrading when WebCrypto is unavailable", () => {
    // crypto is a getter-only, configurable property on modern runtimes:
    // stub it via defineProperty, restore the original descriptor after.
    const desc = Object.getOwnPropertyDescriptor(globalThis, "crypto");
    Object.defineProperty(globalThis, "crypto", {
      value: undefined,
      configurable: true,
    });
    try {
      expect(() => generateSecretKey()).toThrow(/WebCrypto unavailable/);
    } finally {
      if (desc) Object.defineProperty(globalThis, "crypto", desc);
    }
  });
});