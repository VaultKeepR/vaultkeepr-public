





import { sha1 } from "@noble/hashes/legacy.js";
import { utf8ToBytes, bytesToHex } from "@noble/hashes/utils.js";

const RANGE_BASE = "https://api.pwnedpasswords.com/range/";

export type PwnedPasswordFetchOptions = {
  signal?: AbortSignal;

  fetchFn?: typeof fetch;
};




export async function getPwnedPasswordCount(
password: string,
options?: PwnedPasswordFetchOptions)
: Promise<number> {
  if (!password.length) return 0;

  const hash = bytesToHex(sha1(utf8ToBytes(password))).toUpperCase();
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  const fetchFn = options?.fetchFn ?? fetch;
  const res = await fetchFn(`${RANGE_BASE}${prefix}`, {
    method: "GET",
    signal: options?.signal,
    headers: {
      "Add-Padding": "true",
      "User-Agent": "VaultKeeper/1.0 (password check)"
    }
  });

  if (!res.ok) {
    throw new Error(`PwnedPasswords API: ${res.status}`);
  }

  const text = await res.text();
  const suffixUpper = suffix.toUpperCase();

  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const colon = trimmed.indexOf(":");
    if (colon < 0) continue;
    const h = trimmed.slice(0, colon).toUpperCase();
    const countStr = trimmed.slice(colon + 1);
    if (h === suffixUpper) {
      const n = parseInt(countStr, 10);
      return Number.isFinite(n) ? n : 0;
    }
  }

  return 0;
}