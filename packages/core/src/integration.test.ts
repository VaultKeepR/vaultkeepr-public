










import { describe, it, expect } from "vitest";
import {
  encryptVault,
  decryptVault,
  deriveKeyFromPasswordArgon2,
  deriveKeyFromPasswordAndSignatureArgon2,
  generateSaltArgon2,
  serializeVault,
  parseVault,
  createEmptyVault,
  addEntry } from
"./index";
import { createKeyEnvelope, decryptKeyEnvelope } from "./envelope";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import { randomBytes } from "@noble/ciphers/utils.js";



function makeTestVault() {
  let vault = createEmptyVault();
  vault = addEntry(vault, {
    url: "https://example.com",
    username: "satoshi@bitcoin.org",
    password: "correct-horse-battery-staple",
    notes: "Test entry for integration tests",
    folder: "default"
  });
  vault = addEntry(vault, {
    url: "https://bank.example.com",
    username: "alice",
    password: "s3cur3-p4ssw0rd!",
    notes: "Banking credentials",
    folder: "finance"
  });
  return vault;
}

const TEST_PASSWORD = "MyS3cur3M@st3rP4ssw0rd!2024";
const TEST_SIGNATURE =
"0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ff";



describe("Argon2id round-trip (v2 flow)", () => {
  it("should derive key, encrypt, and decrypt a vault correctly", async () => {
    const vault = makeTestVault();
    const vaultJson = serializeVault(vault);
    const salt = generateSaltArgon2();


    const keyForEncrypt = await deriveKeyFromPasswordArgon2(TEST_PASSWORD, salt);
    expect(keyForEncrypt).toBeInstanceOf(Uint8Array);
    expect(keyForEncrypt.length).toBe(32);


    const encrypted = encryptVault(vaultJson, keyForEncrypt);
    expect(encrypted.ciphertext).toBeTruthy();
    expect(encrypted.nonce).toBeTruthy();
    expect(encrypted.commitment).toBeTruthy();


    const keyForDecrypt = await deriveKeyFromPasswordArgon2(TEST_PASSWORD, salt);


    const decrypted = decryptVault(encrypted, keyForDecrypt);
    const recovered = parseVault(decrypted);

    expect(recovered.entries.length).toBe(vault.entries.length);
    expect(recovered.entries[0].url).toBe("https://example.com");
    expect(recovered.entries[0].username).toBe("satoshi@bitcoin.org");
    expect(recovered.entries[0].password).toBe("correct-horse-battery-staple");
    expect(recovered.entries[1].url).toBe("https://bank.example.com");
  });

  it("should produce different keys for same password with different salts", async () => {
    const salt1 = generateSaltArgon2();
    const salt2 = generateSaltArgon2();

    const key1 = await deriveKeyFromPasswordArgon2(TEST_PASSWORD, salt1);
    const key2 = await deriveKeyFromPasswordArgon2(TEST_PASSWORD, salt2);

    expect(bytesToHex(key1)).not.toBe(bytesToHex(key2));
  });

  it("should produce same key for same password and salt", async () => {
    const salt = generateSaltArgon2();

    const key1 = await deriveKeyFromPasswordArgon2(TEST_PASSWORD, salt);
    const key2 = await deriveKeyFromPasswordArgon2(TEST_PASSWORD, salt);

    expect(bytesToHex(key1)).toBe(bytesToHex(key2));
  });

  it("should fail decryption with wrong password", async () => {
    const vault = makeTestVault();
    const vaultJson = serializeVault(vault);
    const salt = generateSaltArgon2();

    const correctKey = await deriveKeyFromPasswordArgon2(TEST_PASSWORD, salt);
    const wrongKey = await deriveKeyFromPasswordArgon2("wrong-password!", salt);

    const encrypted = encryptVault(vaultJson, correctKey);


    let threw = false;
    try {
      decryptVault(encrypted, wrongKey);
    } catch {
      threw = true;
    }
    expect(threw).toBe(true);
  });
});



describe("Full v3 flow (password + wallet signature)", () => {
  it("should encrypt and decrypt with password + signature binding", async () => {
    const vault = makeTestVault();
    const vaultJson = serializeVault(vault);
    const salt = generateSaltArgon2();


    const keyForEncrypt = await deriveKeyFromPasswordAndSignatureArgon2(
      TEST_PASSWORD,
      TEST_SIGNATURE,
      salt
    );
    expect(keyForEncrypt).toBeInstanceOf(Uint8Array);
    expect(keyForEncrypt.length).toBe(32);


    const encrypted = encryptVault(vaultJson, keyForEncrypt);


    const keyForDecrypt = await deriveKeyFromPasswordAndSignatureArgon2(
      TEST_PASSWORD,
      TEST_SIGNATURE,
      salt
    );


    const decrypted = decryptVault(encrypted, keyForDecrypt);
    const recovered = parseVault(decrypted);

    expect(recovered.entries.length).toBe(vault.entries.length);
    expect(recovered.entries[0].password).toBe("correct-horse-battery-staple");
  });

  it("should produce different key with different signature", async () => {
    const salt = generateSaltArgon2();

    const key1 = await deriveKeyFromPasswordAndSignatureArgon2(
      TEST_PASSWORD,
      TEST_SIGNATURE,
      salt
    );
    const differentSig = "0x" + "aa".repeat(65);
    const key2 = await deriveKeyFromPasswordAndSignatureArgon2(
      TEST_PASSWORD,
      differentSig,
      salt
    );

    expect(bytesToHex(key1)).not.toBe(bytesToHex(key2));
  });

  it("should fail with correct password but wrong signature", async () => {
    const vault = makeTestVault();
    const vaultJson = serializeVault(vault);
    const salt = generateSaltArgon2();

    const correctKey = await deriveKeyFromPasswordAndSignatureArgon2(
      TEST_PASSWORD,
      TEST_SIGNATURE,
      salt
    );
    const wrongSigKey = await deriveKeyFromPasswordAndSignatureArgon2(
      TEST_PASSWORD,
      "0x" + "bb".repeat(65),
      salt
    );

    const encrypted = encryptVault(vaultJson, correctKey);

    let threw = false;
    try {decryptVault(encrypted, wrongSigKey);} catch {threw = true;}
    expect(threw).toBe(true);
  });

  it("should fail with correct signature but wrong password", async () => {
    const vault = makeTestVault();
    const vaultJson = serializeVault(vault);
    const salt = generateSaltArgon2();

    const correctKey = await deriveKeyFromPasswordAndSignatureArgon2(
      TEST_PASSWORD,
      TEST_SIGNATURE,
      salt
    );
    const wrongPwdKey = await deriveKeyFromPasswordAndSignatureArgon2(
      "wrong-password",
      TEST_SIGNATURE,
      salt
    );

    const encrypted = encryptVault(vaultJson, correctKey);

    let threw = false;
    try {decryptVault(encrypted, wrongPwdKey);} catch {threw = true;}
    expect(threw).toBe(true);
  });

  it("v2 key ≠ v3 key for same password (signature changes the key)", async () => {
    const salt = generateSaltArgon2();

    const v2Key = await deriveKeyFromPasswordArgon2(TEST_PASSWORD, salt);
    const v3Key = await deriveKeyFromPasswordAndSignatureArgon2(
      TEST_PASSWORD,
      TEST_SIGNATURE,
      salt
    );

    expect(bytesToHex(v2Key)).not.toBe(bytesToHex(v3Key));
  });
});



describe("Tampering resistance", () => {
  let key: Uint8Array;
  let encrypted: ReturnType<typeof encryptVault>;


  it("setup: encrypt a vault", async () => {
    const vault = makeTestVault();
    const salt = generateSaltArgon2();
    key = await deriveKeyFromPasswordArgon2(TEST_PASSWORD, salt);
    encrypted = encryptVault(serializeVault(vault), key);
  });

  it("should detect tampered ciphertext", () => {
    const tampered = { ...encrypted };

    const mid = Math.floor(tampered.ciphertext.length / 2);
    const c = tampered.ciphertext[mid];
    const replacement = c === "a" ? "b" : "a";
    tampered.ciphertext =
    tampered.ciphertext.slice(0, mid) +
    replacement +
    tampered.ciphertext.slice(mid + 1);

    expect(() => decryptVault(tampered, key)).toThrow();
  });

  it("should detect tampered nonce", () => {
    const tampered = { ...encrypted };
    const mid = Math.floor(tampered.nonce.length / 2);
    const c = tampered.nonce[mid];
    const replacement = c === "a" ? "b" : "a";
    tampered.nonce =
    tampered.nonce.slice(0, mid) +
    replacement +
    tampered.nonce.slice(mid + 1);

    expect(() => decryptVault(tampered, key)).toThrow();
  });

  it("should detect tampered commitment", () => {
    const tampered = { ...encrypted };
    if (tampered.commitment) {
      const mid = Math.floor(tampered.commitment.length / 2);
      const c = tampered.commitment[mid];
      const replacement = c === "a" ? "b" : "a";
      tampered.commitment =
      tampered.commitment.slice(0, mid) +
      replacement +
      tampered.commitment.slice(mid + 1);
    }

    expect(() => decryptVault(tampered, key)).toThrow();
  });

  it("should detect swapped commitment (from another encryption)", async () => {

    const otherEncrypted = encryptVault("different plaintext", key);

    const tampered = { ...encrypted };
    tampered.commitment = otherEncrypted.commitment;

    expect(() => decryptVault(tampered, key)).toThrow();
  });
});



describe("ECIES envelope round-trip", () => {
  it("should encrypt and decrypt a master key via ECIES envelope", () => {
    const { secp256k1 } = require("@noble/curves/secp256k1.js");


    const recipientPriv = secp256k1.utils.randomSecretKey();
    const recipientPub = secp256k1.getPublicKey(recipientPriv, false);
    const recipientPubHex = bytesToHex(recipientPub);


    const masterKey = randomBytes(32);


    const envelope = createKeyEnvelope(masterKey, recipientPubHex);
    expect(envelope.ephemeralPublicKey).toBeTruthy();
    expect(envelope.ciphertext).toBeTruthy();
    expect(envelope.nonce).toBeTruthy();


    const recoveredKey = decryptKeyEnvelope(
      envelope,
      bytesToHex(recipientPriv)
    );

    expect(bytesToHex(recoveredKey)).toBe(bytesToHex(masterKey));
  });

  it("should fail decryption with wrong recipient key", () => {
    const { secp256k1 } = require("@noble/curves/secp256k1.js");

    const recipientPriv = secp256k1.utils.randomSecretKey();
    const recipientPub = secp256k1.getPublicKey(recipientPriv, false);
    const recipientPubHex = bytesToHex(recipientPub);

    const wrongPriv = secp256k1.utils.randomSecretKey();

    const masterKey = randomBytes(32);
    const envelope = createKeyEnvelope(masterKey, recipientPubHex);

    let threw = false;
    try {decryptKeyEnvelope(envelope, bytesToHex(wrongPriv));} catch {threw = true;}
    expect(threw).toBe(true);
  });
});



describe("Argon2id configuration", () => {
  it("should use 64 MiB memory (m=65536)", async () => {

    const salt = generateSaltArgon2();
    expect(salt.length).toBe(16);

    const start = performance.now();
    const key = await deriveKeyFromPasswordArgon2(TEST_PASSWORD, salt);
    const elapsed = performance.now() - start;

    expect(key.length).toBe(32);


    expect(elapsed).toBeGreaterThan(5);
  });

  it("salt should be 16 bytes (128-bit)", () => {
    const salt = generateSaltArgon2();
    expect(salt.length).toBe(16);


    const salt2 = generateSaltArgon2();
    expect(bytesToHex(salt)).not.toBe(bytesToHex(salt2));
  });
});