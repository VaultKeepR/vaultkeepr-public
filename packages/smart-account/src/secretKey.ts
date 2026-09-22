


















import { bytesToHex } from "viem";




export function generateSecretKey(): string {
  const bytes = new Uint8Array(32);
  // Secret material: fail loudly rather than degrade to a predictable
  // fallback. Math.random() here would silently produce a guessable
  // 256-bit key on runtimes without WebCrypto (CWE-338).
  if (typeof globalThis.crypto?.getRandomValues !== "function") {
    throw new Error(
      "WebCrypto unavailable: cannot generate a secret key securely"
    );
  }
  globalThis.crypto.getRandomValues(bytes);
  return bytesToHex(bytes).slice(2);
}




export function isValidSecretKey(key: string): boolean {
  return typeof key === "string" && /^[0-9a-f]{64}$/i.test(key);
}





export function formatSecretKeyForDisplay(key: string): string {
  const clean = key.replace(/[^0-9a-f]/gi, "").toLowerCase();
  return clean.match(/.{1,8}/g)?.join("-") ?? clean;
}




export function parseSecretKeyInput(input: string): string {
  return input.replace(/[-\s]/g, "").toLowerCase();
}