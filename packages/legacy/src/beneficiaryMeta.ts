
















import { hkdf } from "@noble/hashes/hkdf.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";
import { randomBytes } from "@noble/ciphers/utils.js";
import { utf8ToBytes, bytesToHex, hexToBytes } from "@noble/hashes/utils.js";

const HKDF_INFO = "vaultkeepr-bene-v1";
const NONCE_LENGTH = 24;
const KEY_LENGTH = 32;



export interface BeneficiaryMetaEntry {
  label: string;
  email?: string;
  address?: string;
  status: "pending" | "confirmed";
}

interface EncryptedBeneMeta {

  v: 1;

  ciphertext: string;

  nonce: string;
}



function deriveKey(masterPassword: string): Uint8Array {
  const ikm = sha256(utf8ToBytes(masterPassword));
  const info = utf8ToBytes(HKDF_INFO);
  return hkdf(sha256, ikm, undefined, info, KEY_LENGTH);
}



export function encryptBeneficiaryMeta(
masterPassword: string,
beneficiaries: BeneficiaryMetaEntry[])
: EncryptedBeneMeta {
  const key = deriveKey(masterPassword);
  const nonce = randomBytes(NONCE_LENGTH);
  const plaintext = utf8ToBytes(JSON.stringify(beneficiaries));
  const cipher = xchacha20poly1305(key, nonce);
  const ciphertext = cipher.encrypt(plaintext);
  return {
    v: 1,
    ciphertext: bytesToHex(ciphertext),
    nonce: bytesToHex(nonce)
  };
}



export function decryptBeneficiaryMeta(
masterPassword: string,
encrypted: EncryptedBeneMeta)
: BeneficiaryMetaEntry[] {
  const key = deriveKey(masterPassword);
  const nonce = hexToBytes(encrypted.nonce);
  const ciphertext = hexToBytes(encrypted.ciphertext);
  const cipher = xchacha20poly1305(key, nonce);
  const plaintext = cipher.decrypt(ciphertext);
  return JSON.parse(new TextDecoder().decode(plaintext)) as BeneficiaryMetaEntry[];
}



const API_BASE =
typeof process !== "undefined" && process.env?.EXPO_PUBLIC_API_URL ||
typeof window !== "undefined" && (window as any).VAULT_APP_URL ||
"https://app.vaultkeepr.xyz";

function apiBase(): string {
  return (API_BASE as string).replace(/\/$/, "");
}


export interface BeneSyncAuthOptions {
  // The owner proof for one request, signed now with the account key. The upload and the store are two requests with
  // two actions, so each asks its own proof. Null when the key is not readable: nothing is sent then.
  proofFor?: (action: "upload" | "legacy-beneficiaries") => Promise<{ signature: string; message: string } | null>;
}










export async function syncBeneficiariesToIpfs(
ownerAddress: string,
masterPassword: string,
beneficiaries: BeneficiaryMetaEntry[],
authOptions?: BeneSyncAuthOptions)
: Promise<string | null> {
  if (!masterPassword || !ownerAddress || beneficiaries.length === 0) return null;
  try {
    const encrypted = encryptBeneficiaryMeta(masterPassword, beneficiaries);
    const payload = JSON.stringify(encrypted);


    const uploadBody: Record<string, unknown> = {
      encryptedPayload: payload,
      walletAddress: ownerAddress.toLowerCase()
    };

    const upProof = authOptions?.proofFor ? await authOptions.proofFor("upload") : null;
    if (!upProof) return null;
    uploadBody.signature = upProof.signature;
    uploadBody.message = upProof.message;

    const uploadRes = await fetch(`${apiBase()}/api/ipfs/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(uploadBody)
    });

    if (!uploadRes.ok) return null;
    const { cid } = (await uploadRes.json()) as {cid?: string;};
    if (!cid) return null;


    const storeBody: Record<string, unknown> = { owner: ownerAddress.toLowerCase(), walletAddress: ownerAddress.toLowerCase(), cid };
    const storeProof = authOptions?.proofFor ? await authOptions.proofFor("legacy-beneficiaries") : null;
    if (!storeProof) return null;
    storeBody.signature = storeProof.signature;
    storeBody.message = storeProof.message;

    const storeRes = await fetch(`${apiBase()}/api/legacy/beneficiaries-cid`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(storeBody)
    });

    if (!storeRes.ok) return null;
    return cid;
  } catch {
    return null;
  }
}





export async function fetchBeneficiariesFromIpfs(
ownerAddress: string,
masterPassword: string)
: Promise<BeneficiaryMetaEntry[] | null> {
  if (!masterPassword || !ownerAddress) return null;
  try {

    const cidRes = await fetch(
      `${apiBase()}/api/legacy/beneficiaries-cid?owner=${encodeURIComponent(ownerAddress.toLowerCase())}`
    );
    if (!cidRes.ok) return null;
    const { cid } = (await cidRes.json()) as {cid?: string | null;};
    if (!cid) return null;


    const { fetchFromStorage } = await import("@vaultkeepr/ipfs");
    const raw = await fetchFromStorage(cid);
    const encrypted = JSON.parse(raw) as EncryptedBeneMeta;


    return decryptBeneficiaryMeta(masterPassword, encrypted);
  } catch {
    return null;
  }
}