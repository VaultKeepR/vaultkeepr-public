import { describe, it, expect } from "vitest";
import {
  generatePasskeyKeyPair,
  generateCredentialId,
  publicKeyToCose,
  signPasskeyAssertion,
  verifyPasskeyAssertion,
  rpIdHash,
  buildAuthDataForCreate,
  buildAuthDataForGet,
  buildAttestationObject,
  toBase64Url,
  fromBase64Url,
  encryptPasskeyPrivateKey,
  decryptPasskeyPrivateKey,
  isPasskeyPrivateKeyEncrypted } from
"./passkey-crypto";
import { generateMasterKey } from "./crypto";

describe("Passkey crypto (P-256 / ES256)", () => {
  describe("Key generation", () => {
    it("generates a valid key pair", () => {
      const kp = generatePasskeyKeyPair();
      expect(kp.privateKey.length).toBe(32);
      expect(kp.publicKey.length).toBe(65);
      expect(kp.publicKey[0]).toBe(0x04);
    });

    it("generates different keys each time", () => {
      const kp1 = generatePasskeyKeyPair();
      const kp2 = generatePasskeyKeyPair();
      expect(kp1.privateKey).not.toEqual(kp2.privateKey);
    });

    it("generates 16-byte credential IDs", () => {
      const id = generateCredentialId();
      expect(id.length).toBe(16);
    });
  });

  describe("COSE encoding", () => {
    it("encodes a 65-byte uncompressed key to COSE", () => {
      const kp = generatePasskeyKeyPair();
      const cose = publicKeyToCose(kp.publicKey);


      expect(cose[0]).toBe(0xa5);
      expect(cose.length).toBeGreaterThan(70);
    });

    it("throws for invalid key length", () => {
      expect(() => publicKeyToCose(new Uint8Array(32))).toThrow("65-byte");
    });
  });

  describe("WebAuthn signing/verification", () => {
    it("signs and verifies an assertion", () => {
      const kp = generatePasskeyKeyPair();
      const authData = new Uint8Array(37);
      const clientHash = new Uint8Array(32).fill(0xab);

      const sig = signPasskeyAssertion(kp.privateKey, authData, clientHash);
      const valid = verifyPasskeyAssertion(kp.publicKey, authData, clientHash, sig);

      expect(valid).toBe(true);
    });

    it("fails verification with wrong public key", () => {
      const kp1 = generatePasskeyKeyPair();
      const kp2 = generatePasskeyKeyPair();
      const authData = new Uint8Array(37);
      const clientHash = new Uint8Array(32).fill(0xab);

      const sig = signPasskeyAssertion(kp1.privateKey, authData, clientHash);
      const valid = verifyPasskeyAssertion(kp2.publicKey, authData, clientHash, sig);

      expect(valid).toBe(false);
    });

    it("fails verification with tampered data", () => {
      const kp = generatePasskeyKeyPair();
      const authData = new Uint8Array(37);
      const clientHash = new Uint8Array(32).fill(0xab);
      const tamperedHash = new Uint8Array(32).fill(0xac);

      const sig = signPasskeyAssertion(kp.privateKey, authData, clientHash);
      const valid = verifyPasskeyAssertion(kp.publicKey, authData, tamperedHash, sig);

      expect(valid).toBe(false);
    });
  });

  describe("Auth data builders", () => {
    it("buildAuthDataForCreate has AT flag set", () => {
      const kp = generatePasskeyKeyPair();
      const credId = generateCredentialId();
      const authData = buildAuthDataForCreate("example.com", credId, kp.publicKeyCose);


      expect(authData.length).toBe(32 + 1 + 4 + 16 + 2 + credId.length + kp.publicKeyCose.length);

      expect(authData[32]).toBe(0x45);
    });

    it("buildAuthDataForGet is exactly 37 bytes", () => {
      const authData = buildAuthDataForGet("example.com", 0);
      expect(authData.length).toBe(37);

      expect(authData[32]).toBe(0x05);
    });

    it("buildAuthDataForGet clears UV flag when userVerification is discouraged (W5)", () => {
      const authData = buildAuthDataForGet("example.com", 0, "discouraged");

      expect(authData[32]).toBe(0x01);
    });

    it("buildAuthDataForGet keeps UV flag for required/preferred (W5)", () => {
      const required = buildAuthDataForGet("example.com", 0, "required");
      const preferred = buildAuthDataForGet("example.com", 0, "preferred");
      expect(required[32]).toBe(0x05);
      expect(preferred[32]).toBe(0x05);
    });

    it("rpIdHash produces SHA-256 of the RP ID", () => {
      const hash = rpIdHash("example.com");
      expect(hash.length).toBe(32);
    });
  });

  describe("Attestation object", () => {
    it("builds a valid CBOR attestation object", () => {
      const kp = generatePasskeyKeyPair();
      const credId = generateCredentialId();
      const authData = buildAuthDataForCreate("example.com", credId, kp.publicKeyCose);
      const attObj = buildAttestationObject(authData);


      expect(attObj[0]).toBe(0xa3);
    });
  });

  describe("Base64URL encoding", () => {
    it("roundtrips binary data", () => {
      const data = new Uint8Array([0, 1, 127, 128, 255]);
      const encoded = toBase64Url(data);
      const decoded = fromBase64Url(encoded);
      expect(decoded).toEqual(data);
    });

    it("produces URL-safe characters", () => {
      const data = new Uint8Array([251, 252, 253, 254, 255]);
      const encoded = toBase64Url(data);
      expect(encoded).not.toMatch(/[+/=]/);
    });
  });

  describe("Passkey private key encryption", () => {
    it("encrypts and decrypts a private key", () => {
      const kp = generatePasskeyKeyPair();
      const masterKey = generateMasterKey();
      const credentialId = "test-credential-id-12345";

      const encrypted = encryptPasskeyPrivateKey(kp.privateKey, masterKey, credentialId);
      const decrypted = decryptPasskeyPrivateKey(encrypted, masterKey, credentialId);

      expect(decrypted).toEqual(kp.privateKey);
    });

    it("produces 144 hex chars (24 nonce + 48 ciphertext)", () => {
      const kp = generatePasskeyKeyPair();
      const masterKey = generateMasterKey();

      const encrypted = encryptPasskeyPrivateKey(kp.privateKey, masterKey, "cred-id");

      expect(encrypted.length).toBe(144);
    });

    it("different credentialIds produce different ciphertexts", () => {
      const kp = generatePasskeyKeyPair();
      const masterKey = generateMasterKey();

      const enc1 = encryptPasskeyPrivateKey(kp.privateKey, masterKey, "cred-1");
      const enc2 = encryptPasskeyPrivateKey(kp.privateKey, masterKey, "cred-2");

      expect(enc1).not.toBe(enc2);
    });

    it("wrong master key fails to decrypt", () => {
      const kp = generatePasskeyKeyPair();
      const masterKey = generateMasterKey();
      const wrongKey = generateMasterKey();

      const encrypted = encryptPasskeyPrivateKey(kp.privateKey, masterKey, "cred");

      expect(() => decryptPasskeyPrivateKey(encrypted, wrongKey, "cred")).toThrow();
    });

    it("wrong credential ID fails to decrypt", () => {
      const kp = generatePasskeyKeyPair();
      const masterKey = generateMasterKey();

      const encrypted = encryptPasskeyPrivateKey(kp.privateKey, masterKey, "cred-1");

      expect(() => decryptPasskeyPrivateKey(encrypted, masterKey, "cred-2")).toThrow();
    });

    it("isPasskeyPrivateKeyEncrypted detects encrypted vs legacy keys", () => {
      expect(isPasskeyPrivateKeyEncrypted("a".repeat(144))).toBe(true);
      expect(isPasskeyPrivateKeyEncrypted("a".repeat(64))).toBe(false);
      expect(isPasskeyPrivateKeyEncrypted("short")).toBe(false);
    });

    it("throws on too-short encrypted data", () => {
      const masterKey = generateMasterKey();
      expect(() =>
      decryptPasskeyPrivateKey("a".repeat(48), masterKey, "cred")
      ).toThrow("length");
    });
  });
});
describe("publicKeyToSpki", () => {
  it("wraps an uncompressed P-256 point into SubjectPublicKeyInfo DER", async () => {
    const { generatePasskeyKeyPair, publicKeyToSpki, P256_SPKI_HEADER } =
      await import("./passkey-crypto");
    const { publicKey } = generatePasskeyKeyPair();
    const spki = publicKeyToSpki(publicKey);

    expect(spki).toHaveLength(91);
    expect(Array.from(spki.slice(0, 26))).toEqual(Array.from(P256_SPKI_HEADER));
    expect(Array.from(spki.slice(26))).toEqual(Array.from(publicKey));
  });

  it("throws for invalid key length", async () => {
    const { publicKeyToSpki } = await import("./passkey-crypto");
    expect(() => publicKeyToSpki(new Uint8Array(64))).toThrow(
      "Expected 65-byte uncompressed P-256 public key"
    );
  });
});
