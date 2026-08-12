import { encryptVault, decryptVault } from "./crypto";
import { deriveKeyFromPasswordArgon2, generateSaltArgon2, type Argon2Options } from "./kdf-argon2";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import type { Vault } from "./types";
import { serializeVault, parseVault } from "./vault";

const ENCRYPTED_EXPORT_FORMAT = "vault-keeper-encrypted";

export interface EncryptedExportPayload {
  version: number;
  format: string;
  salt: string;
  nonce: string;
  ciphertext: string;
  commitment?: string;
  exportedAt?: string;

  secretKey?: string;

  kdf?: {name: string;t: number;m: number;p: number;dkLen: number;};
}


export async function exportEncryptedVault(vault: Vault, password: string, secretKey?: string, argon2Opts?: Argon2Options, precomputed?: {key: Uint8Array;salt: Uint8Array;}): Promise<string> {






  const salt = precomputed?.salt ?? generateSaltArgon2();
  const key = precomputed?.key ?? (await deriveKeyFromPasswordArgon2(password, salt, argon2Opts));




  const plaintext = JSON.stringify({
    vault: serializeVault(vault),
    ...(secretKey ? { secretKey } : {})
  });
  const encrypted = encryptVault(plaintext, key);
  const payload: EncryptedExportPayload = {
    version: 2,
    format: ENCRYPTED_EXPORT_FORMAT,
    salt: bytesToHex(salt),
    nonce: encrypted.nonce,
    ciphertext: encrypted.ciphertext,
    commitment: encrypted.commitment,
    exportedAt: new Date().toISOString(),


    kdf: {
      name: "argon2id",
      t: argon2Opts?.t ?? 3,
      m: argon2Opts?.m ?? 65536,
      p: argon2Opts?.p ?? 4,
      dkLen: argon2Opts?.dkLen ?? 32
    }
  };
  return JSON.stringify(payload, null, 2);
}


export function isEncryptedExport(jsonStr: string): boolean {
  try {
    const data = JSON.parse(jsonStr.trim()) as {format?: string;};
    return data?.format === ENCRYPTED_EXPORT_FORMAT;
  } catch {
    return false;
  }
}


export interface EncryptedImportResult {
  vault: Vault;

  secretKey?: string;
}

export async function importEncryptedVault(encryptedJson: string, password: string, argon2Opts?: Argon2Options): Promise<EncryptedImportResult> {
  const payload = JSON.parse(encryptedJson.trim()) as EncryptedExportPayload;
  if (payload?.format !== ENCRYPTED_EXPORT_FORMAT || !payload.salt || !payload.nonce || !payload.ciphertext) {
    throw new Error("Format d'export chiffré invalide.");
  }
  const salt = hexToBytes(payload.salt);



  const effectiveOpts: Argon2Options = payload.kdf ?
  { t: payload.kdf.t, m: payload.kdf.m, p: payload.kdf.p, dkLen: payload.kdf.dkLen } :
  argon2Opts ?? {};
  const key = await deriveKeyFromPasswordArgon2(password, salt, effectiveOpts);
  const plaintext = decryptVault(
    {
      ciphertext: payload.ciphertext,
      nonce: payload.nonce,
      commitment: payload.commitment,
      version: payload.commitment ? 2 : 1
    },
    key
  );


  let vaultData: string = plaintext as string;
  let secretKey: string | undefined = payload.secretKey;
  try {
    const parsed = JSON.parse(plaintext as string);
    if (parsed && typeof parsed === "object" && "vault" in parsed) {
      vaultData = parsed.vault;
      secretKey = parsed.secretKey ?? payload.secretKey;
    }
  } catch {

  }
  const vault = parseVault(vaultData);
  return { vault, secretKey };
}