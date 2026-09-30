




import { split, combine } from "shamir-secret-sharing";
import { hkdf } from "@noble/hashes/hkdf.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { randomBytes } from "@noble/ciphers/utils.js";
import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";
import { utf8ToBytes, bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import {
  encryptVault,
  decryptVault,
  generateMasterKey,
  parseVault,
  serializeVault,
  type Vault,
  type EncryptedVault,
  type EncryptedFragmentPayload,
  type FragmentedConfig,
  FRAGMENTED_DEFAULT_THRESHOLD,
  FRAGMENTED_DEFAULT_TOTAL } from
"@vault-keeper/core";

const KEY_LENGTH = 32;
const NONCE_LENGTH = 24;
const HKDF_INFO = utf8ToBytes("vaultkeepr-v5-fragmented-recovery");


export function computeLookupIdHash(recoveryId: string): string {
  const bytes = utf8ToBytes(recoveryId);
  const hash = sha256(bytes);
  return bytesToHex(hash);
}


function derivePartEncryptionKey(recoveryId: string, salt?: Uint8Array): Uint8Array {
  const input = utf8ToBytes(recoveryId);


  const hkdfSalt = salt ?? sha256(input);
  return hkdf(sha256, input, hkdfSalt, HKDF_INFO, KEY_LENGTH);
}


export function encryptFragment(
fragment: Uint8Array,
index: number,
recoveryId: string)
: EncryptedFragmentPayload {
  const key = derivePartEncryptionKey(recoveryId);
  const nonce = randomBytes(NONCE_LENGTH);
  const chacha = xchacha20poly1305(key, nonce);
  const ciphertext = chacha.encrypt(fragment);
  return {
    version: 5,
    fragmentIndex: index,
    ciphertext: bytesToHex(ciphertext),
    nonce: bytesToHex(nonce)
  };
}


export function decryptFragment(
encrypted: EncryptedFragmentPayload,
recoveryId: string)
: Uint8Array {
  const key = derivePartEncryptionKey(recoveryId);
  const nonce = hexToBytes(encrypted.nonce);
  const ciphertext = hexToBytes(encrypted.ciphertext);
  const chacha = xchacha20poly1305(key, nonce);
  return chacha.decrypt(ciphertext);
}


export const DEFAULT_FRAGMENTED_CONFIG: FragmentedConfig = {
  threshold: FRAGMENTED_DEFAULT_THRESHOLD,
  total: FRAGMENTED_DEFAULT_TOTAL,
  distribution: {
    device: 0,
    ipfs: 1,
    contact: 2,
    smartcontract: 3,
    api: 4
  }
};

export interface CreateFragmentedResult {
  masterKey: Uint8Array;
  encryptedVault: EncryptedVault;
  fragments: Uint8Array[];
  lookupIdHash: string;
  config: FragmentedConfig;
}




export async function createFragmentedVault(
vault: Vault,
recoveryId: string,
config: FragmentedConfig = DEFAULT_FRAGMENTED_CONFIG)
: Promise<CreateFragmentedResult> {
  const masterKey = generateMasterKey();
  const plaintext = serializeVault(vault);
  const encryptedVault = encryptVault(plaintext, masterKey, { wipeKeyAfterUse: false });

  const fragments = await split(
    masterKey,
    config.total,
    config.threshold
  );

  const lookupIdHash = computeLookupIdHash(recoveryId);

  return {
    masterKey,
    encryptedVault,
    fragments,
    lookupIdHash,
    config
  };
}




export function encryptFragmentsForStorage(
fragments: Uint8Array[],
recoveryId: string,
indices: number[])
: EncryptedFragmentPayload[] {
  return indices.map((i) => encryptFragment(fragments[i], i, recoveryId));
}




export async function combineFragmentsAndDecrypt(
fragments: Uint8Array[],
encryptedVault: EncryptedVault,
threshold: number)
: Promise<Vault> {
  if (fragments.length < threshold) {
    throw new Error(`At least ${threshold} parts required, received ${fragments.length}`);
  }
  const masterKey = await combine(fragments.slice(0, threshold));
  try {
    const plaintext = decryptVault(encryptedVault, masterKey, { wipeKeyAfterUse: false });
    if (typeof plaintext !== "string") {
      throw new Error("Expected string payload but got binary in fragmented recovery");
    }
    return parseVault(plaintext as string);
  } finally {
    masterKey.fill(0);
  }
}


export function generateRecoveryId(): string {
  const bytes = randomBytes(16);
  return bytesToHex(bytes);
}