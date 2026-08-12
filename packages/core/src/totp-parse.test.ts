import { describe, it, expect } from "vitest";
import { parseTOTPUri } from "./totp";

describe("parseTOTPUri", () => {
  it("parses a valid URI with all parameters", () => {
    const result = parseTOTPUri(
      "otpauth://totp/Issuer:account@example.com?secret=JBSWY3DPEHPK3PXP&algorithm=SHA256&digits=8&period=60&issuer=Issuer"
    );
    expect(result).not.toBeNull();
    expect(result!.secret).toBe("JBSWY3DPEHPK3PXP");
    expect(result!.algorithm).toBe("SHA-256");
    expect(result!.digits).toBe(8);
    expect(result!.period).toBe(60);
    expect(result!.issuer).toBe("Issuer");
    expect(result!.account).toBe("account@example.com");
  });

  it("uses defaults when only secret is provided", () => {
    const result = parseTOTPUri("otpauth://totp/test?secret=JBSWY3DPEHPK3PXP");
    expect(result).not.toBeNull();
    expect(result!.algorithm).toBe("SHA-1");
    expect(result!.digits).toBe(6);
    expect(result!.period).toBe(30);
  });

  it("parses SHA-512 algorithm", () => {
    const result = parseTOTPUri(
      "otpauth://totp/test?secret=JBSWY3DPEHPK3PXP&algorithm=SHA512"
    );
    expect(result).not.toBeNull();
    expect(result!.algorithm).toBe("SHA-512");
  });

  it("falls back to SHA-1 for unknown algorithm", () => {
    const result = parseTOTPUri(
      "otpauth://totp/test?secret=JBSWY3DPEHPK3PXP&algorithm=MD5"
    );
    expect(result).not.toBeNull();
    expect(result!.algorithm).toBe("SHA-1");
  });

  it("returns null when secret is missing", () => {
    const result = parseTOTPUri("otpauth://totp/test");
    expect(result).toBeNull();
  });

  it("returns null for non-TOTP URI", () => {
    const result = parseTOTPUri(
      "otpauth://hotp/test?secret=JBSWY3DPEHPK3PXP"
    );
    expect(result).toBeNull();
  });

  it("returns null for invalid/malformed URI", () => {
    const result = parseTOTPUri("not-a-uri");
    expect(result).toBeNull();
  });

  it("defaults digits to 6 when out of range", () => {
    const result = parseTOTPUri(
      "otpauth://totp/test?secret=JBSWY3DPEHPK3PXP&digits=2"
    );
    expect(result).not.toBeNull();
    expect(result!.digits).toBe(6);
  });

  it("defaults period to 30 when out of range", () => {
    const result = parseTOTPUri(
      "otpauth://totp/test?secret=JBSWY3DPEHPK3PXP&period=2"
    );
    expect(result).not.toBeNull();
    expect(result!.period).toBe(30);
  });

  it("extracts account from pathname", () => {
    const result = parseTOTPUri(
      "otpauth://totp/MyApp:user@example.com?secret=JBSWY3DPEHPK3PXP"
    );
    expect(result).not.toBeNull();
    expect(result!.account).toBe("user@example.com");
  });
});