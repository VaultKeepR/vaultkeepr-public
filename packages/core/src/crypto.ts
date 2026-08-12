import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";
import { randomBytes } from "@noble/ciphers/utils.js";
import { hmac } from "@noble/hashes/hmac.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { utf8ToBytes, bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import type { EncryptedVault } from "./types";
import { secureWipe, secureCompare } from "./secure";

const NONCE_LENGTH = 24;
const KEY_LENGTH = 32;

const ENCRYPTED_VAULT_VERSION = 3;

const COMMITMENT_DOMAIN = new TextEncoder().encode("vaultkeepr-v3-commitment");

export function generateMasterKey(): Uint8Array {
  return randomBytes(KEY_LENGTH);
}

export function encryptVault(
plaintext: string | Uint8Array,
masterKey: Uint8Array,
opts?: {wipeKeyAfterUse?: boolean;})
: EncryptedVault {
  const nonce = randomBytes(NONCE_LENGTH);
  const chacha = xchacha20poly1305(masterKey, nonce);
  const plaintextBytes =
  typeof plaintext === "string" ? utf8ToBytes(plaintext) : plaintext;
  const ciphertextBytes = chacha.encrypt(plaintextBytes);
  const commitmentInput = new Uint8Array(
    COMMITMENT_DOMAIN.length + ciphertextBytes.length
  );
  commitmentInput.set(COMMITMENT_DOMAIN);
  commitmentInput.set(ciphertextBytes, COMMITMENT_DOMAIN.length);
  const commitmentBytes = hmac(sha256, masterKey, commitmentInput);
  const commitment = bytesToHex(commitmentBytes);

  if (opts?.wipeKeyAfterUse !== false) {
    secureWipe(masterKey);
  }

  return {
    ciphertext: bytesToHex(ciphertextBytes),
    nonce: bytesToHex(nonce),
    commitment,
    version: ENCRYPTED_VAULT_VERSION
  };
}

export function decryptVault(
encrypted: EncryptedVault,
masterKey: Uint8Array,
opts?: {wipeKeyAfterUse?: boolean;})
: string | Uint8Array {
  const ciphertextBytes = hexToBytes(encrypted.ciphertext);


  if (encrypted.commitment) {
    const commitmentInput = new Uint8Array(
      COMMITMENT_DOMAIN.length + ciphertextBytes.length
    );
    commitmentInput.set(COMMITMENT_DOMAIN);
    commitmentInput.set(ciphertextBytes, COMMITMENT_DOMAIN.length);
    const computed = hmac(sha256, masterKey, commitmentInput);
    const stored = hexToBytes(encrypted.commitment);
    const valid = secureCompare(computed, stored);
    secureWipe(computed);
    if (!valid) {
      secureWipe(stored);
      throw new Error("Invalid commitment - possible substitution attack");
    }
    secureWipe(stored);
  } else if ((encrypted.version ?? 2) >= 3) {

    throw new Error(
      "Missing commitment for v3+ vault - integrity check required"
    );
  }

  const nonce = hexToBytes(encrypted.nonce);
  const chacha = xchacha20poly1305(masterKey, nonce);
  const plaintext = chacha.decrypt(ciphertextBytes);

  if (opts?.wipeKeyAfterUse !== false) {
    secureWipe(masterKey);
  }


  const isAutomerge =
  plaintext.length >= 4 &&
  plaintext[0] === 0x85 &&
  plaintext[1] === 0x6f &&
  plaintext[2] === 0x4a &&
  plaintext[3] === 0x83;

  if (isAutomerge) {
    return plaintext;
  }

  return new TextDecoder().decode(plaintext);
}

export async function compressVault(vaultJson: string): Promise<Uint8Array> {

  if (typeof CompressionStream !== "undefined") {
    const stream = new Blob([vaultJson]).
    stream().
    pipeThrough(new CompressionStream("gzip"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }

  return new TextEncoder().encode(vaultJson);
}




const MAX_DECOMPRESSED_SIZE = 50 * 1024 * 1024;

export async function decompressVault(data: Uint8Array): Promise<string> {

  if (data.length >= 2 && data[0] === 0x1f && data[1] === 0x8b) {
    if (typeof DecompressionStream !== "undefined") {
      const buf = new Uint8Array(data).buffer as ArrayBuffer;
      const stream = new Blob([buf]).
      stream().
      pipeThrough(new DecompressionStream("gzip"));
      const decompressed = await new Response(stream).arrayBuffer();
      if (decompressed.byteLength > MAX_DECOMPRESSED_SIZE) {
        throw new Error(
          `Decompressed vault too large: ${Math.round(decompressed.byteLength / 1024 / 1024)}MB (max ${MAX_DECOMPRESSED_SIZE / 1024 / 1024}MB)`
        );
      }
      return new TextDecoder().decode(decompressed);
    }
  }

  return new TextDecoder().decode(data);
}