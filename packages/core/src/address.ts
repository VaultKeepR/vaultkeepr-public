import { keccak_256 } from "@noble/hashes/sha3.js";
import { utf8ToBytes } from "@noble/hashes/utils.js";






export function getChecksumAddress(address: string): string {
  const a = address.replace(/^0x/i, "").toLowerCase();
  if (a.length !== 40) return address;
  const hash = keccak_256(utf8ToBytes(a));
  let result = "0x";
  for (let i = 0; i < 40; i++) {
    const c = a[i]!;
    const nibble = hash[i >>> 1]! >>> (i % 2 ? 0 : 4) & 0xf;
    result += /[a-f]/.test(c) && nibble >= 8 ? c.toUpperCase() : c;
  }
  return result;
}