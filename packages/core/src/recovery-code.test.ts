import { describe, it, expect } from "vitest";
import {
  RECOVERY_CODE_LENGTH,
  generateRecoveryCode,
  normalizeRecoveryCode,
  isValidRecoveryCode,
  formatRecoveryCode,
  deriveRecoveryId,
  createRecoveryBlob,
  openRecoveryBlob,
  isAccountKeyText,
  argon2RecoveryKdf,
  type RecoveryKdf,
} from "./recovery-code";

const SK = "0123456789abcdef".repeat(4); // 64 hex characters

describe("recovery code", () => {
  it("generates a 100-bit code in Crockford base32", () => {
    const code = generateRecoveryCode();
    expect(code).toHaveLength(RECOVERY_CODE_LENGTH);
    expect(RECOVERY_CODE_LENGTH * 5).toBe(100);
    expect(isValidRecoveryCode(code)).toBe(true);
    expect(generateRecoveryCode()).not.toBe(code);
  });

  it("normalizes case, separators and look-alike characters", () => {
    expect(normalizeRecoveryCode(" ab-c ")).toBe("ABC");
    expect(normalizeRecoveryCode("o1il-0")).toBe("01110");
  });

  it("derives a stable ID that depends on the code only", async () => {
    const code = generateRecoveryCode();
    const id = await deriveRecoveryId(code);
    expect(id).toMatch(/^[0-9a-f]{64}$/);
    expect(await deriveRecoveryId(formatRecoveryCode(code).toLowerCase())).toBe(id);
    expect(await deriveRecoveryId(generateRecoveryCode())).not.toBe(id);
  }, 120000);

  it("round-trips the secret key and never stores it in clear", async () => {
    const code = generateRecoveryCode();
    const blob = await createRecoveryBlob(SK, code);
    expect(await openRecoveryBlob(blob, code)).toBe(SK);
    expect(JSON.stringify(blob)).not.toContain(SK);
  }, 120000);

  it("uses a fresh salt and nonce for each blob", async () => {
    const code = generateRecoveryCode();
    const a = await createRecoveryBlob(SK, code);
    const b = await createRecoveryBlob(SK, code);
    expect(a.salt).not.toBe(b.salt);
    expect(a.encrypted.nonce).not.toBe(b.encrypted.nonce);
  }, 120000);

  it("refuses a wrong code and a tampered blob with the same error", async () => {
    const code = generateRecoveryCode();
    const blob = await createRecoveryBlob(SK, code);
    await expect(openRecoveryBlob(blob, generateRecoveryCode())).rejects.toThrow("Recovery failed");
    const tampered = { ...blob, encrypted: { ...blob.encrypted, commitment: "00".repeat(32) } };
    await expect(openRecoveryBlob(tampered, code)).rejects.toThrow("Recovery failed");
  }, 120000);

  it("rejects a weak code and an invalid secret key before any derivation", async () => {
    await expect(createRecoveryBlob(SK, "ABCDEFGH")).rejects.toThrow("Invalid recovery code");
    await expect(createRecoveryBlob("not-a-key", generateRecoveryCode())).rejects.toThrow("Invalid secret key");
  });

  it("derives with the injected KDF for both the ID and the blob (mobile WebView path)", async () => {
    const seen: number[] = [];
    const recording: RecoveryKdf = (bytes, salt) => {
      seen.push(salt.length);
      return argon2RecoveryKdf(bytes, salt);
    };
    const code = generateRecoveryCode();
    const blob = await createRecoveryBlob(SK, code, recording);
    await deriveRecoveryId(code, recording);
    expect(seen).toHaveLength(2);
    expect(await openRecoveryBlob(blob, code, recording)).toBe(SK);
  }, 120000);
});

describe("account keys in other formats", () => {
  // Deterministic test KDF: the blob logic is what is under test, not Argon2.
  const testKdf = (async (code: Uint8Array, salt: Uint8Array) =>
    Uint8Array.from({ length: 32 }, (_, i) => (code[i % code.length] ^ salt[i % salt.length]) & 0xff)) as RecoveryKdf;
  const exportFormat = '{"iv":"' + "A".repeat(24) + '","data":"' + "B".repeat(260) + '"}';

  it("seals and opens an account key in the export format exactly as given", async () => {
    const code = generateRecoveryCode();
    const blob = await createRecoveryBlob(exportFormat, code, testKdf);
    expect(await openRecoveryBlob(blob, code, testKdf)).toBe(exportFormat);
  });

  it("refuses the extension envelope shape and PGP armour as account keys", async () => {
    const envelope = '{"v":1,"iv":"' + "A".repeat(16) + '","ct":"' + "B".repeat(480) + '"}';
    await expect(createRecoveryBlob(envelope, generateRecoveryCode(), testKdf)).rejects.toThrow("Invalid secret key");
    await expect(createRecoveryBlob("-----BEGIN PGP MESSAGE-----" + "A".repeat(40), generateRecoveryCode(), testKdf)).rejects.toThrow("Invalid secret key");
  });

  it("accepts 64-hex keys and refuses text shorter than 32 characters", () => {
    expect(isAccountKeyText(SK)).toBe(true);
    expect(isAccountKeyText("x".repeat(31))).toBe(false);
    expect(isAccountKeyText("x".repeat(32))).toBe(true);
  });
});
