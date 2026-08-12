



export function secureWipe(buf: Uint8Array | null): void {
  if (buf && buf.length > 0) {
    buf.fill(0);



    if (buf[0] !== 0) throw new Error("secureWipe: unexpected non-zero byte after wipe");
  }
}


export function secureCompare(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}