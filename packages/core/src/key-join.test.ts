import { describe, it, expect, vi } from "vitest";
import { prepareKeyJoin, joinWithKeyCode, type JoinFetch, type JoinPost } from "./key-join";
import { decideEncryptedImport } from "./import-key-policy";
import {
  deriveRecoveryId,
  generateRecoveryCode,
  normalizeRecoveryCode,
  type RecoveryBlob,
  type RecoveryKdf,
} from "./recovery-code";

const SK = "0123456789abcdef".repeat(4);
const OTHER_SK = "fedcba9876543210".repeat(4);

// Fast deterministic KDF for the flow tests: the ID and the blob still depend on the code and the salt.
const fastKdf: RecoveryKdf = (codeBytes, salt) => {
  const out = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    out[i] = (codeBytes[i % codeBytes.length] * 31 + salt[i % salt.length] * 17 + i * 7) & 0xff;
  }
  return out;
};

/** A server that follows the rules of the real route: one ID per blob, a read forgets the blob. */
function fakeServer() {
  const store = new Map<string, RecoveryBlob>();
  const post: JoinPost = async (id, blob) => {
    if (store.has(id)) throw new Error("conflict");
    store.set(id, blob);
  };
  const fetchBlob: JoinFetch = async (id) => {
    const blob = store.get(id) ?? null;
    store.delete(id);
    return blob;
  };
  return { store, post, fetchBlob };
}

describe("key join: the code moves the secret key between devices, once", () => {
  it("returns the same secret key, and the server forgets the blob after one read", async () => {
    const server = fakeServer();
    const { code } = await prepareKeyJoin(SK, server.post, fastKdf);

    expect(await joinWithKeyCode(code, server.fetchBlob, fastKdf)).toBe(SK);
    await expect(joinWithKeyCode(code, server.fetchBlob, fastKdf)).rejects.toMatchObject({
      code: "not_found",
    });
  });

  it("posts only an ID and a blob: neither the code nor the key appear in clear", async () => {
    const posted: Array<{ id: string; blob: RecoveryBlob }> = [];
    const { code } = await prepareKeyJoin(
      SK,
      async (id, blob) => {
        posted.push({ id, blob });
      },
      fastKdf,
    );
    const normalized = normalizeRecoveryCode(code);
    const raw = JSON.stringify(posted);

    expect(raw).not.toContain(SK);
    expect(raw).not.toContain(normalized);
    expect(posted[0].id).toBe(await deriveRecoveryId(normalized, fastKdf));
  });

  it("finds nothing for a different code, and does not consume the real blob", async () => {
    const server = fakeServer();
    const { code } = await prepareKeyJoin(SK, server.post, fastKdf);
    const wrong = generateRecoveryCode();

    await expect(joinWithKeyCode(wrong, server.fetchBlob, fastKdf)).rejects.toMatchObject({
      code: "not_found",
    });
    expect(server.store.size).toBe(1);
    expect(await joinWithKeyCode(code, server.fetchBlob, fastKdf)).toBe(SK);
  });

  it("refuses a malformed code before any request", async () => {
    const fetchBlob = vi.fn(async () => null);

    await expect(joinWithKeyCode("ABC", fetchBlob, fastKdf)).rejects.toMatchObject({
      code: "invalid_code",
    });
    expect(fetchBlob).not.toHaveBeenCalled();
  });

  it("accepts a code typed in lower case, with spaces instead of hyphens", async () => {
    const server = fakeServer();
    const { code } = await prepareKeyJoin(SK, server.post, fastKdf);
    const typed = code.toLowerCase().replace(/-/g, " ");

    expect(await joinWithKeyCode(typed, server.fetchBlob, fastKdf)).toBe(SK);
  });

  it("refuses a value that is not a secret key, before anything is posted", async () => {
    const post = vi.fn(async () => undefined);

    await expect(prepareKeyJoin("not-a-key", post, fastKdf)).rejects.toThrow("Invalid secret key");
    expect(post).not.toHaveBeenCalled();
  });
});

describe("encrypted import: a file never changes the account of a device", () => {
  it("imports a keyless file on a device without a key (local vault, no address)", () => {
    expect(decideEncryptedImport({ deviceKey: null, fileKey: null })).toEqual({
      action: "import_keyless",
    });
  });

  it("joins the file's account when the device has no key and the file has one", () => {
    expect(decideEncryptedImport({ deviceKey: null, fileKey: SK })).toEqual({
      action: "join_with_file_key",
    });
  });

  it("refuses a keyless file on a keyed device: it would create a parallel identity", () => {
    expect(decideEncryptedImport({ deviceKey: SK, fileKey: null })).toEqual({
      action: "refuse",
      reason: "keyless_file_on_keyed_device",
    });
  });

  it("keeps the device key when the file holds the same key, whatever the letter case", () => {
    expect(decideEncryptedImport({ deviceKey: SK, fileKey: SK.toUpperCase() })).toEqual({
      action: "keep_device_key",
    });
  });

  it("refuses a file of another account: the device key is never overwritten", () => {
    expect(decideEncryptedImport({ deviceKey: SK, fileKey: OTHER_SK })).toEqual({
      action: "refuse",
      reason: "other_account",
    });
  });
});
