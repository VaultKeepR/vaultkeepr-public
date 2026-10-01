import { describe, it, expect } from "vitest";
import { encryptBeneficiaryMeta, decryptBeneficiaryMeta } from "./beneficiaryMeta";

describe("beneficiary meta encryption", () => {
  const entries = [
    { label: "Alice", email: "alice@example.com", status: "confirmed" as const },
    { label: "Bob", address: "0x1234567890abcdef", status: "pending" as const }
  ];

  it("roundtrips through encrypt/decrypt", () => {
    const enc = encryptBeneficiaryMeta("correct horse battery staple", entries);
    expect(enc.v).toBe(1);
    expect(enc.ciphertext.length).toBeGreaterThan(0);
    expect(enc.nonce.length).toBeGreaterThan(0);
    const dec = decryptBeneficiaryMeta("correct horse battery staple", enc);
    expect(dec).toEqual(entries);
  });

  it("fails to decrypt with a wrong password", () => {
    const enc = encryptBeneficiaryMeta("right-password", entries);
    expect(() => decryptBeneficiaryMeta("wrong-password", enc)).toThrow();
  });

  it("uses a fresh nonce and ciphertext per call", () => {
    const a = encryptBeneficiaryMeta("pw", entries);
    const b = encryptBeneficiaryMeta("pw", entries);
    expect(a.nonce).not.toBe(b.nonce);
    expect(a.ciphertext).not.toBe(b.ciphertext);
  });
});
