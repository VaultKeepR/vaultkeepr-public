import { hmac } from "@noble/hashes/hmac.js";
import { sha1 } from "@noble/hashes/legacy.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { sha512 } from "@noble/hashes/sha2.js";

const TOTP_STEP_SEC = 30;

export type TOTPAlgorithm = "SHA-1" | "SHA-256" | "SHA-512";

function base32Decode(input: string): Uint8Array {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const clean = input.replace(/\s/g, "").toUpperCase().replace(/=+$/, "");
  const bits: number[] = [];
  for (let i = 0; i < clean.length; i++) {
    const idx = alphabet.indexOf(clean[i]);
    if (idx < 0) continue;
    for (let b = 4; b >= 0; b--) bits.push(idx >> b & 1);
  }
  const out: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = byte << 1 | bits[i + j];
    out.push(byte);
  }
  return new Uint8Array(out);
}


const HASH_FNS = {
  "SHA-1": sha1,
  "SHA-256": sha256,
  "SHA-512": sha512
} as const;









export function getTOTPCode(
secretBase32: string,
algorithm: TOTPAlgorithm = "SHA-1",
digits: number = 6,
period: number = TOTP_STEP_SEC)
: string {
  if (!secretBase32?.trim()) return "";
  const key = base32Decode(secretBase32.trim());
  const counter = Math.floor(Date.now() / 1000 / period);
  const msg = new Uint8Array(8);
  let c = counter;
  for (let i = 7; i >= 0; i--) {
    msg[i] = c & 0xff;
    c = Math.floor(c / 256);
  }
  const hashFn = HASH_FNS[algorithm] ?? sha1;
  const hash = hmac(hashFn, key, msg);
  const offset = hash[hash.length - 1]! & 0x0f;
  const code =
  (hash[offset]! & 0x7f) << 24 |
  (hash[offset + 1]! & 0xff) << 16 |
  (hash[offset + 2]! & 0xff) << 8 |
  hash[offset + 3]! & 0xff;
  const mod = 10 ** digits;
  return (code % mod).toString().padStart(digits, "0");
}


export function getTOTPRemainingSeconds(period: number = TOTP_STEP_SEC): number {
  return period - Math.floor(Date.now() / 1000) % period;
}





export function parseTOTPUri(uri: string): {
  secret: string;
  algorithm: TOTPAlgorithm;
  digits: number;
  period: number;
  issuer?: string;
  account?: string;
} | null {
  if (!uri.startsWith("otpauth://totp/")) return null;
  try {
    const url = new URL(uri);
    const secret = url.searchParams.get("secret") ?? "";
    if (!secret) return null;

    const rawAlgo = (url.searchParams.get("algorithm") ?? "SHA1").toUpperCase().replace(/[^A-Z0-9]/g, "");
    let algorithm: TOTPAlgorithm = "SHA-1";
    if (rawAlgo === "SHA256" || rawAlgo === "SHA2256") algorithm = "SHA-256";else
    if (rawAlgo === "SHA512" || rawAlgo === "SHA2512") algorithm = "SHA-512";

    const digits = parseInt(url.searchParams.get("digits") ?? "6", 10);
    const period = parseInt(url.searchParams.get("period") ?? "30", 10);
    const issuer = url.searchParams.get("issuer") ?? undefined;
    const account = decodeURIComponent(url.pathname.replace(/^\/totp\//, "")).replace(/^[^:]*:/, "").trim() || undefined;

    return {
      secret: secret.toUpperCase(),
      algorithm,
      digits: Number.isFinite(digits) && digits >= 4 && digits <= 8 ? digits : 6,
      period: Number.isFinite(period) && period >= 10 && period <= 120 ? period : 30,
      issuer,
      account
    };
  } catch {
    return null;
  }
}