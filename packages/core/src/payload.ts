import type { VaultPayload } from "./types";
import { encryptVault, generateMasterKey } from "./crypto";
import { createKeyEnvelope } from "./envelope";

export function createVaultPayload(
vaultJson: string,
walletPublicKeyHex: string)
: {payload: VaultPayload;masterKey: Uint8Array;} {
  const masterKey = generateMasterKey();
  const encrypted = encryptVault(vaultJson, masterKey, { wipeKeyAfterUse: false });
  const envelope = createKeyEnvelope(masterKey, walletPublicKeyHex);

  return {
    payload: {
      ciphertext: encrypted.ciphertext,
      nonce: encrypted.nonce,
      envelope,
      version: 1
    },
    masterKey
  };
}

export function parseVaultPayload(json: string): VaultPayload {
  const parsed = JSON.parse(json);
  if (!parsed.ciphertext || !parsed.envelope) {
    throw new Error("Invalid vault payload format");
  }
  return parsed as VaultPayload;
}