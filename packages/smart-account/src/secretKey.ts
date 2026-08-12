


















import { bytesToHex } from "viem";




export function generateSecretKey(): string {
  const bytes = new Uint8Array(32);
  if (typeof globalThis.crypto?.getRandomValues === "function") {
    globalThis.crypto.getRandomValues(bytes);
  } else {

    for (let i = 0; i < 32; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
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