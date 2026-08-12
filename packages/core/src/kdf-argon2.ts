import { argon2id } from "@noble/hashes/argon2.js";

const SALT_LENGTH = 16;
const HASH_LENGTH = 32;

const ARGON2_TIME = 3;
const ARGON2_MEMORY = 65536;
const ARGON2_PARALLELISM = 4;

const ARGON2_OPTS = {
  t: ARGON2_TIME,
  m: ARGON2_MEMORY,
  p: ARGON2_PARALLELISM,
  dkLen: HASH_LENGTH
};


export interface Argon2Options {
  t?: number;
  m?: number;
  p?: number;
  dkLen?: number;
}

export function deriveKeyFromPasswordArgon2(
password: string,
salt: Uint8Array,
opts?: Argon2Options)
: Uint8Array {
  return argon2id(
    new TextEncoder().encode(password),
    salt,
    opts ? { ...ARGON2_OPTS, ...opts } : ARGON2_OPTS
  );
}

export function generateSaltArgon2(): Uint8Array {
  const salt = new Uint8Array(SALT_LENGTH);
  crypto.getRandomValues(salt);
  return salt;
}












export function normalizeSignatureForKdf(signatureHex: string): string {
  if (!signatureHex) return "";
  const clean = signatureHex.replace(/^0x/i, "").toLowerCase();

  if (clean.length === 130) {
    return clean.slice(0, 128);
  }

  return clean;
}

function sigHexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}





export function deriveKeyFromPasswordAndSignatureArgon2(
password: string,
signatureHex: string,
salt: Uint8Array)
: Uint8Array {
  const normalized = normalizeSignatureForKdf(signatureHex);
  const sigBytes = sigHexToBytes(normalized);
  const passwordBytes = new TextEncoder().encode(password);
  const combined = new Uint8Array(passwordBytes.length + sigBytes.length);
  combined.set(passwordBytes);
  combined.set(sigBytes, passwordBytes.length);

  return argon2id(combined, salt, ARGON2_OPTS);
}





export function deriveKeyFromPasswordAndSignatureLegacy(
password: string,
signatureHex: string,
salt: Uint8Array)
: Uint8Array {
  if (!signatureHex) throw new Error("Signature manquante pour la dérivation Legacy.");
  const sigHex = signatureHex.replace(/^0x/, "");
  const sigBytes = sigHexToBytes(sigHex);
  const passwordBytes = new TextEncoder().encode(password);
  const combined = new Uint8Array(passwordBytes.length + sigBytes.length);
  combined.set(passwordBytes);
  combined.set(sigBytes, passwordBytes.length);

  return argon2id(combined, salt, ARGON2_OPTS);
}