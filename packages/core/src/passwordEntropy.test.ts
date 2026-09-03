import { describe, it, expect } from "vitest";
import { estimatePasswordEntropy } from "./passwordEntropy";

describe("estimatePasswordEntropy", () => {
  it("scores a long random password as excellent", () => {
    const r = estimatePasswordEntropy("X#k9!mZ$p@2wL&qR!aBcD7");
    expect(r.effectiveBits).toBeGreaterThanOrEqual(80);
    expect(r.strength).toBe("excellent");
    expect(r.dictionaryPenaltyBits).toBe(0);
  });

  it("penalizes dictionary words", () => {
    const r = estimatePasswordEntropy("sunshine");
    expect(r.dictionaryPenaltyBits).toBeGreaterThan(0);
    expect(r.effectiveBits).toBeLessThan(r.charsetEntropyBits);
    expect(r.strength).toBe("critical");
  });

  it("penalizes leet substitutions of dictionary words", () => {
    const plain = estimatePasswordEntropy("absence");
    const leet = estimatePasswordEntropy("@bsence");
    expect(leet.dictionaryPenaltyBits).toBeGreaterThan(0);
    expect(leet.effectiveBits).toBeLessThan(leet.charsetEntropyBits);
    expect(leet.effectiveBits - plain.effectiveBits).toBeLessThan(15);
  });

  it("penalizes keyboard sequences", () => {
    const r = estimatePasswordEntropy("Azerty123!");
    expect(r.patternPenaltyBits).toBeGreaterThan(0);
  });

  it("penalizes repeats and years", () => {
    const r = estimatePasswordEntropy("Password2024!");
    expect(r.patternPenaltyBits + r.dictionaryPenaltyBits).toBeGreaterThan(0);
  });

  it("penalizes runs of identical characters", () => {
    const r = estimatePasswordEntropy("AAAAAAAAAAAA");
    expect(r.patternPenaltyBits).toBeGreaterThan(0);
    expect(r.effectiveBits).toBeLessThan(30);
  });

  it("computes charset entropy for random strings", () => {
    const r = estimatePasswordEntropy("kV9m");
    expect(r.poolSize).toBeGreaterThan(0);
    expect(r.entropyBits).toBeCloseTo(4 * Math.log2(r.poolSize), 1);
  });

  it("returns instant crack time for tiny passwords", () => {
    const r = estimatePasswordEntropy("aZ3");
    expect(r.crackTimeDisplay).toBe("instant");
    expect(r.strength).toBe("critical");
  });

  it("shows uncrackable for very high entropy", () => {
    const r = estimatePasswordEntropy("qW7#mN2$pL9@vX4!bR6&zT1*hJ5%");
    expect(r.crackTimeDisplay).toBe("beyond practical cracking");
  });

  it("never returns negative effective bits", () => {
    const r = estimatePasswordEntropy("password");
    expect(r.effectiveBits).toBeGreaterThanOrEqual(0);
  });

  it("treats dictionary fragments inside longer passwords with partial penalty", () => {
    const withWord = estimatePasswordEntropy("dolphinXk9#mQv2");
    const baseline = estimatePasswordEntropy("Xk9#mQv2Lp!zR4");
    expect(withWord.effectiveBits).toBeLessThan(baseline.effectiveBits);
  });

  it("strength ladder respects thresholds", () => {
    expect(estimatePasswordEntropy("abcdefghijklmnop").strength).not.toBe("excellent");
    expect(estimatePasswordEntropy("").strength).toBe("critical");
  });
});
