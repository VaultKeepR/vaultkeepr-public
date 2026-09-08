import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../../..");

// Old-stack primitives: exactly what cloud + android resolve TODAY (pre-bump).
const NOBLE18_HASHES = resolve(ROOT, "packages/cloud/node_modules/@noble/hashes");
const NOBLE05_CIPHERS = resolve(ROOT, "node_modules/@noble/ciphers");

const { argon2id } = await import(`${NOBLE18_HASHES}/argon2.js`);
const { hmac } = await import(`${NOBLE18_HASHES}/hmac.js`);
const { sha256 } = await import(`${NOBLE18_HASHES}/sha2.js`);
const { utf8ToBytes, bytesToHex } = await import(`${NOBLE18_HASHES}/utils.js`);
const { xchacha20poly1305 } = await import(`${NOBLE05_CIPHERS}/chacha.js`);

const enc = new TextEncoder();

// Mirror of packages/core/src/kdf-argon2.ts ARGON2_OPTS
const ARGON2_OPTS = { t: 3, m: 65536, p: 4, dkLen: 32 };

// Fixed inputs — deterministic vector, no randomness.
const PASSWORD = "golden-vector-v1";
const SALT_HEX = "0f1e2d3c4b5a69788796a5b4c3d2e1f0";
const NONCE_HEX = "00112233445566778899aabbccddeeff0011223344556677";

// Mirror of packages/core/src/vault.ts serializeVault
function serializeVault(vault) {
  const sanitized = {
    ...vault,
    entries: vault.entries.map((e) => ({
      ...e,
      url: e.url ?? "",
      username: e.username ?? "",
      password: e.password ?? "",
      notes: e.notes ?? undefined,
      folder: e.folder ?? undefined,
      totpSecret: e.totpSecret ?? undefined
    })),
    cloudFiles: vault.cloudFiles ?? undefined,
    cloudFolders: vault.cloudFolders ?? undefined,
    cloudQuotaUsed: vault.cloudQuotaUsed ?? 0,
    prfCredentials: vault.prfCredentials ?? undefined
  };
  return JSON.stringify(sanitized);
}

const vault = {
  version: 1,
  createdAt: "2026-09-07T00:00:00.000Z",
  entries: [
    {
      id: "gv-1",
      url: "https://golden.vaultkeepr.xyz",
      username: "golden",
      password: "noble-1-8-to-2-4",
      createdAt: "2026-09-07T00:00:00.000Z"
    },
    {
      id: "gv-2",
      url: "",
      username: "Visa - golden",
      password: "",
      folder: "cartes",
      createdAt: "2026-09-07T00:00:00.000Z"
    }
  ],
  folders: []
};

// Mirror of packages/core/src/encrypted-export.ts exportEncryptedVault
const salt = new Uint8Array(SALT_HEX.match(/.{2}/g).map((h) => parseInt(h, 16)));
const key = argon2id(enc.encode(PASSWORD), salt, ARGON2_OPTS);

const plaintext = JSON.stringify({ vault: serializeVault(vault) });

const NONCE_LENGTH = 24;
const nonce = new Uint8Array(NONCE_HEX.match(/.{2}/g).map((h) => parseInt(h, 16)));
if (nonce.length !== NONCE_LENGTH) throw new Error("bad nonce length");

const chacha = xchacha20poly1305(key, nonce);
const ciphertextBytes = chacha.encrypt(enc.encode(plaintext));

// Mirror of packages/core/src/crypto.ts COMMITMENT_DOMAIN
const COMMITMENT_DOMAIN = enc.encode("vaultkeepr-v3-commitment");
const commitmentInput = new Uint8Array(COMMITMENT_DOMAIN.length + ciphertextBytes.length);
commitmentInput.set(COMMITMENT_DOMAIN);
commitmentInput.set(ciphertextBytes, COMMITMENT_DOMAIN.length);
const commitment = bytesToHex(hmac(sha256, key, commitmentInput));

const payload = {
  version: 2,
  format: "vault-keeper-encrypted",
  salt: SALT_HEX,
  nonce: NONCE_HEX,
  ciphertext: bytesToHex(ciphertextBytes),
  commitment,
  exportedAt: "2026-09-07T00:00:00.000Z",
  kdf: { name: "argon2id", t: 3, m: 65536, p: 4, dkLen: 32 }
};

const outPath = resolve(__dirname, "../tests/fixtures/golden-noble18-vault.json");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(payload, null, 2) + "\n");
console.log("golden vector written:", outPath);
console.log("ciphertext bytes:", ciphertextBytes.length);
console.log("key fingerprint:", bytesToHex(hmac(sha256, key, enc.encode("fp"))).slice(0, 16));
