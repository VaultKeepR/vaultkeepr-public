/**
 * Joining an account with its secret key, through a 100-bit code (recovery-code.ts).
 *
 * The sending device seals its secret key under a key derived from the code, and posts only the blob,
 * under an ID derived from the code. The server never sees the code or the key. The receiving device
 * types the code, derives the same ID, fetches the blob (the server forgets it after one read), and opens it.
 *
 * Transport is injected (post / fetchBlob), so each client uses its own HTTP stack.
 */
import {
  createRecoveryBlob,
  deriveRecoveryId,
  formatRecoveryCode,
  generateRecoveryCode,
  isValidRecoveryCode,
  normalizeRecoveryCode,
  openRecoveryBlob,
  type RecoveryBlob,
  type RecoveryKdf,
} from "./recovery-code";

export type JoinPost = (id: string, blob: RecoveryBlob) => Promise<void>;
export type JoinFetch = (id: string) => Promise<RecoveryBlob | null>;

export class KeyJoinError extends Error {
  constructor(readonly code: "invalid_code" | "not_found") {
    super(code);
    this.name = "KeyJoinError";
  }
}

/**
 * Sending device: creates a code, seals the secret key under it, and posts the blob.
 * Returns the code to show to the user (grouped, for reading). Nothing is sent before the blob exists.
 */
export async function prepareKeyJoin(
  secretKeyHex: string,
  post: JoinPost,
  kdf?: RecoveryKdf,
): Promise<{ code: string }> {
  const code = generateRecoveryCode();
  const blob = await createRecoveryBlob(secretKeyHex, code, kdf);
  const id = await deriveRecoveryId(code, kdf);
  await post(id, blob);
  return { code: formatRecoveryCode(code) };
}

/**
 * Receiving device: turns the typed code into the account's secret key. A malformed code fails before any
 * request. A code with no blob (wrong, expired, or already used) fails with "not_found".
 */
export async function joinWithKeyCode(
  input: string,
  fetchBlob: JoinFetch,
  kdf?: RecoveryKdf,
): Promise<string> {
  const code = normalizeRecoveryCode(input);
  if (!isValidRecoveryCode(code)) throw new KeyJoinError("invalid_code");
  const id = await deriveRecoveryId(code, kdf);
  const blob = await fetchBlob(id);
  if (!blob) throw new KeyJoinError("not_found");
  return openRecoveryBlob(blob, code, kdf);
}
