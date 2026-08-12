import { describe, it, expect } from "vitest";
import { generatePassword, generatePassphrase, uniformRandom } from "./generatePassword";

describe("uniformRandom", () => {
  it("returns 0 for max=1", () => {
    expect(uniformRandom(1)).toBe(0);
  });

  it("returns 0 for max<=0", () => {
    expect(uniformRandom(0)).toBe(0);
    expect(uniformRandom(-5)).toBe(0);
    expect(uniformRandom(-1)).toBe(0);
  });

  it("returns values in range [0, max)", () => {
    for (let i = 0; i < 200; i++) {
      const val = uniformRandom(10);
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(10);
    }
  });

  it("distribution is roughly uniform over many calls", () => {
    const max = 5;
    const calls = 5000;
    const counts = new Array(max).fill(0);
    for (let i = 0; i < calls; i++) {
      counts[uniformRandom(max)]++;
    }
    const expected = calls / max;
    const tolerance = expected * 0.15;
    for (let i = 0; i < max; i++) {
      expect(counts[i]).toBeGreaterThan(expected - tolerance);
      expect(counts[i]).toBeLessThan(expected + tolerance);
    }
  });
});

describe("generatePassword", () => {
  it("default length is 20", () => {
    const pw = generatePassword();
    expect(pw.length).toBe(20);
  });

  it("custom length is respected", () => {
    const pw = generatePassword({ length: 32 });
    expect(pw.length).toBe(32);
  });

  it("contains at least one uppercase when upper=true", () => {
    for (let i = 0; i < 50; i++) {
      const pw = generatePassword({ upper: true, lower: false, numbers: false, symbols: false });
      expect(pw).toMatch(/[A-Z]/);
    }
  });

  it("contains at least one lowercase when lower=true", () => {
    for (let i = 0; i < 50; i++) {
      const pw = generatePassword({ lower: true, upper: false, numbers: false, symbols: false });
      expect(pw).toMatch(/[a-z]/);
    }
  });

  it("contains at least one digit when numbers=true", () => {
    for (let i = 0; i < 50; i++) {
      const pw = generatePassword({ numbers: true, upper: false, lower: false, symbols: false });
      expect(pw).toMatch(/[0-9]/);
    }
  });

  it("contains at least one symbol when symbols=true", () => {
    const symbolChars = "!@#$%&*+-=?";
    for (let i = 0; i < 50; i++) {
      const pw = generatePassword({ symbols: true, upper: false, lower: false, numbers: false });
      expect(pw.split("").some((c) => symbolChars.includes(c))).toBe(true);
    }
  });

  it("when only lower+numbers, pool is only lowercase+digits", () => {
    const pw = generatePassword({ length: 100, upper: false, lower: true, numbers: true, symbols: false });
    expect(pw).toMatch(/^[a-z0-9]+$/);
  });

  it("output length matches requested length", () => {
    for (const len of [4, 5, 16, 64, 128]) {
      const pw = generatePassword({ length: len });
      expect(pw.length).toBe(len);
    }
  });
});

describe("generatePassphrase", () => {
  it("default 5 words separated by -", () => {
    const pp = generatePassphrase({ separator: "_" });
    const words = pp.split("_");
    expect(words.length).toBe(5);
    for (const w of words) {
      expect(w.length).toBeGreaterThan(0);
    }
  });

  it("custom wordCount is respected", () => {
    const pp = generatePassphrase({ wordCount: 7, separator: "_" });
    const words = pp.split("_");
    expect(words.length).toBe(7);
  });

  it("custom separator is respected", () => {
    const pp = generatePassphrase({ wordCount: 4, separator: " " });
    const words = pp.split(" ");
    expect(words.length).toBe(4);
  });

  it("capitalize=true uppercases first letter of each word", () => {
    for (let i = 0; i < 30; i++) {
      const pp = generatePassphrase({ capitalize: true, wordCount: 5, separator: "_" });
      const words = pp.split("_");
      for (const w of words) {
        expect(w[0]).toMatch(/[A-Z]/);
        expect(w.slice(1)).not.toMatch(/[A-Z]/);
      }
    }
  });

  it("wordCount < 3 is clamped to 3", () => {
    const pp = generatePassphrase({ wordCount: 1, separator: "_" });
    const words = pp.split("_");
    expect(words.length).toBe(3);
  });

  it("wordCount > 10 is clamped to 10", () => {
    const pp = generatePassphrase({ wordCount: 20, separator: "_" });
    const words = pp.split("_");
    expect(words.length).toBe(10);
  });
});