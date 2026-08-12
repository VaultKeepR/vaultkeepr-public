import { describe, it, expect } from "vitest";
import { calculatePasswordStrength } from "./passwordStrength.js";

describe("calculatePasswordStrength", () => {
  it("returns weak for empty password", () => {
    const result = calculatePasswordStrength("");
    expect(result.strength).toBe("weak");
    expect(result.score).toBeLessThan(30);
  });

  it("returns weak for very short password", () => {
    const result = calculatePasswordStrength("ab");
    expect(result.strength).toBe("weak");
  });

  it("returns weak for lowercase only", () => {
    const result = calculatePasswordStrength("abcdefgh");
    expect(result.strength).toBe("weak");
    expect(result.feedback.length).toBeGreaterThan(0);
  });

  it("returns at least medium for mixed alpha+numbers (8 chars)", () => {
    const result = calculatePasswordStrength("Abcd1234");
    expect(["medium", "strong"]).toContain(result.strength);
    expect(result.score).toBeGreaterThanOrEqual(50);
  });

  it("returns strong for 12+ chars with all types", () => {
    const result = calculatePasswordStrength("MyP@ssw0rd!!");
    expect(result.strength).toBe("strong");
    expect(result.score).toBeGreaterThanOrEqual(80);
  });

  it("gives feedback to add uppercase", () => {
    const result = calculatePasswordStrength("password123!");
    expect(result.feedback.some((f) => f.includes("Uppercase") || f.includes("uppercase"))).toBe(true);
  });

  it("gives feedback to add numbers", () => {
    const result = calculatePasswordStrength("MyPassword!!");
    expect(result.feedback.some((f) => f.includes("Numbers") || f.includes("number"))).toBe(true);
  });

  it("gives feedback to add special chars", () => {
    const result = calculatePasswordStrength("MyPassword12");
    expect(result.feedback.some((f) => f.includes("Special") || f.includes("special"))).toBe(true);
  });

  it("score is capped at 100", () => {
    const result = calculatePasswordStrength("X#k9!mZ$p@2wL&qR!aBcD");
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("rewards length >= 12", () => {
    const short = calculatePasswordStrength("Ab1!Xy");
    const long = calculatePasswordStrength("Ab1!XyZz9@Qq");
    expect(long.score).toBeGreaterThan(short.score);
  });

  it("considers 3+ types as good composition", () => {
    const result = calculatePasswordStrength("Abcdefgh1234");

    expect(result.feedback.some((f) => f.includes("multipleTypes"))).toBe(false);
  });

  it("very weak passwords get simplified feedback", () => {
    const result = calculatePasswordStrength("aa");
    expect(result.feedback).toContain("passwordFeedback.veryWeak");
    expect(result.feedback).toHaveLength(1);
  });
});