export const ALIAS_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

export function generateRandomAlias(length = 8): string {
  const chars = ALIAS_CHARS;
  let result = "";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}