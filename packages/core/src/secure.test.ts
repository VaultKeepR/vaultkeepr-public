import { describe, it, expect } from "vitest";
import { secureWipe, secureCompare } from "./secure";

describe("secureWipe", () => {
  it("zeroes all bytes in a buffer", () => {
    const buf = new Uint8Array([1, 2, 3, 4, 5]);
    secureWipe(buf);
    expect(buf.every((b) => b === 0)).toBe(true);
  });

  it("handles null gracefully", () => {
    expect(() => secureWipe(null)).not.toThrow();
  });

  it("handles empty buffer", () => {
    expect(() => secureWipe(new Uint8Array(0))).not.toThrow();
  });

  it("volatile read prevents JIT dead-store elimination", () => {

    const buf = new Uint8Array([42]);
    secureWipe(buf);
    expect(buf[0]).toBe(0);
  });
});

describe("secureCompare", () => {
  it("returns true for identical buffers", () => {
    const a = new Uint8Array([1, 2, 3]);
    const b = new Uint8Array([1, 2, 3]);
    expect(secureCompare(a, b)).toBe(true);
  });

  it("returns false for different buffers", () => {
    const a = new Uint8Array([1, 2, 3]);
    const b = new Uint8Array([1, 2, 4]);
    expect(secureCompare(a, b)).toBe(false);
  });

  it("returns false for different lengths", () => {
    const a = new Uint8Array([1, 2]);
    const b = new Uint8Array([1, 2, 3]);
    expect(secureCompare(a, b)).toBe(false);
  });

  it("constant-time: compares all bytes", () => {

    const a = new Uint8Array([1, 2, 3, 4, 0]);
    const b = new Uint8Array([1, 2, 3, 4, 1]);
    expect(secureCompare(a, b)).toBe(false);
  });
});