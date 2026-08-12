import { describe, it, expect } from "vitest";
import { getCardBrand, maskCardNumber, getLast4, formatCardNumber, digitsOnly, CARD_BRAND_LABELS } from "./cards";

describe("cards", () => {
  it("detects Visa card brand", () => {
    expect(getCardBrand("4111111111111111")).toBe("visa");
  });

  it("detects Mastercard", () => {
    expect(getCardBrand("5555555555554444")).toBe("mastercard");
  });

  it("detects Amex", () => {
    expect(getCardBrand("371449635398431")).toBe("amex");
  });

  it("returns null for unknown brand", () => {
    expect(getCardBrand("1234")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(getCardBrand("")).toBeNull();
  });

  it("masks card number correctly", () => {
    const masked = maskCardNumber("4111111111111111");
    expect(masked).toContain("••••");
    expect(masked).toContain("1111");
  });

  it("getLast4 extracts last 4 digits", () => {
    expect(getLast4("4111111111111111")).toBe("1111");
    expect(getLast4("5555555555554444")).toBe("4444");
  });

  it("getLast4 handles short input", () => {
    expect(getLast4("12")).toBe("12");
    expect(getLast4("")).toBe("");
  });

  it("digitsOnly strips non-digit characters", () => {
    expect(digitsOnly("4111-1111-1111-1111")).toBe("4111111111111111");
    expect(digitsOnly("4111 1111 1111 1111")).toBe("4111111111111111");
  });

  it("formatCardNumber formats with spaces", () => {
    const formatted = formatCardNumber("4111111111111111");
    expect(formatted).toContain(" ");
  });

  it("CARD_BRAND_LABELS has all brands", () => {
    expect(CARD_BRAND_LABELS.visa).toBeDefined();
    expect(CARD_BRAND_LABELS.mastercard).toBeDefined();
    expect(CARD_BRAND_LABELS.amex).toBeDefined();
  });
});