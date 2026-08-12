import { describe, it, expect } from "vitest";
import { getTOTPCode, getTOTPRemainingSeconds } from "./totp";

describe("TOTP", () => {


  const TEST_SECRET = "JBSWY3DPEHPK3PXP";

  it("generates 6-digit code from valid secret", () => {
    const code = getTOTPCode(TEST_SECRET);
    expect(code).toMatch(/^\d{6}$/);
  });

  it("returns consistent code within same 30s window", () => {
    const code1 = getTOTPCode(TEST_SECRET);
    const code2 = getTOTPCode(TEST_SECRET);
    expect(code1).toBe(code2);
  });

  it("returns empty string for invalid secret", () => {
    const code = getTOTPCode("");
    expect(code).toBe("");
  });

  it("getRemainingSeconds returns value between 0 and 30", () => {
    const remaining = getTOTPRemainingSeconds();
    expect(remaining).toBeGreaterThanOrEqual(0);
    expect(remaining).toBeLessThanOrEqual(30);
  });
});