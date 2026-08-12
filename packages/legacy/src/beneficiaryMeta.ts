
















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

  delegationSignature?: string;
  sessionId?: string;
  expiryTimestamp?: number;

  signature?: string;
  message?: string;
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

    if (authOptions?.delegationSignature && authOptions?.sessionId && authOptions?.expiryTimestamp) {
      uploadBody.delegationSignature = authOptions.delegationSignature;
      uploadBody.sessionId = authOptions.sessionId;
      uploadBody.expiryTimestamp = authOptions.expiryTimestamp;
    } else if (authOptions?.signature && authOptions?.message) {
      uploadBody.signature = authOptions.signature;
      uploadBody.message = authOptions.message;
    } else {

      return null;
    }

    const uploadRes = await fetch(`${apiBase()}/api/ipfs/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(uploadBody)
    });

    if (!uploadRes.ok) return null;
    const { cid } = (await uploadRes.json()) as {cid?: string;};
    if (!cid) return null;


    const storeRes = await fetch(`${apiBase()}/api/legacy/beneficiaries-cid`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner: ownerAddress.toLowerCase(), cid })
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


    const { fetchFromStorage } = await import("@vault-keeper/ipfs");
    const raw = await fetchFromStorage(cid);
    const encrypted = JSON.parse(raw) as EncryptedBeneMeta;


    return decryptBeneficiaryMeta(masterPassword, encrypted);
  } catch {
    return null;
  }
}