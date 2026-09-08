import { describe, it, expect } from "vitest";
import { secp256k1 } from "@noble/curves/secp256k1.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { createVaultPayload, parseVaultPayload } from "./payload";
import { decryptKeyEnvelope } from "./envelope";

function keyPair() {
  const priv = secp256k1.utils.randomSecretKey();
  const pub = secp256k1.getPublicKey(priv, false);
  return { privHex: bytesToHex(priv), pubHex: bytesToHex(pub) };
}

describe("createVaultPayload", () => {
  it("returns a version 1 payload with encrypted ciphertext", () => {
    const { pubHex } = keyPair();
    const vaultJson = JSON.stringify({ entries: [{ id: "e1", title: "test" }] });
    const { payload, masterKey } = createVaultPayload(vaultJson, pubHex);

    expect(payload.version).toBe(1);
    expect(typeof payload.ciphertext).toBe("string");
    expect(payload.ciphertext).toMatch(/^[0-9a-f]+$/);
    expect(payload.ciphertext).not.toContain(
      Buffer.from("test", "utf8").toString("hex")
    );
    expect(payload.nonce).toMatch(/^[0-9a-f]{48}$/);
    expect(payload.envelope.nonce).toMatch(/^[0-9a-f]{48}$/);
    expect(masterKey).toBeInstanceOf(Uint8Array);
    expect(masterKey.length).toBe(32);
  });

  it("uses a fresh master key on every call", () => {
    const { pubHex } = keyPair();
    const vaultJson = "{}";
    const first = createVaultPayload(vaultJson, pubHex);
    const second = createVaultPayload(vaultJson, pubHex);
    expect(first.masterKey).not.toEqual(second.masterKey);
    expect(first.payload.ciphertext).not.toEqual(second.payload.ciphertext);
  });

  it("envelope decrypts back to the master key with the recipient private key", () => {
    const { privHex, pubHex } = keyPair();
    const { payload, masterKey } = createVaultPayload("{}", pubHex);
    const recovered = decryptKeyEnvelope(payload.envelope, privHex);
    expect(recovered).toEqual(masterKey);
  });
});

describe("parseVaultPayload", () => {
  it("parses a valid payload JSON", () => {
    const { pubHex } = keyPair();
    const { payload } = createVaultPayload("{}", pubHex);
    const parsed = parseVaultPayload(JSON.stringify(payload));
    expect(parsed).toEqual(payload);
  });

  it("rejects missing ciphertext", () => {
    expect(() =>
      parseVaultPayload(JSON.stringify({ envelope: {}, version: 1 }))
    ).toThrow("Invalid vault payload format");
  });

  it("rejects missing envelope", () => {
    expect(() =>
      parseVaultPayload(JSON.stringify({ ciphertext: "abc", version: 1 }))
    ).toThrow("Invalid vault payload format");
  });

  it("propagates JSON parse errors", () => {
    expect(() => parseVaultPayload("not-json")).toThrow();
  });
});
