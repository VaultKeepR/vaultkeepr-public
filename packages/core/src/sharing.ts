















import { secp256k1 } from "@noble/curves/secp256k1.js";
import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";
import { randomBytes } from "@noble/ciphers/utils.js";
import { hkdf } from "@noble/hashes/hkdf.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, hexToBytes, utf8ToBytes } from "@noble/hashes/utils.js";



const NONCE_LENGTH = 24;
const KEY_LENGTH = 32;
const SHARE_VERSION = 2;
const MAX_PAYLOAD_SIZE = 7 * 1024 * 1024;
const PIN_LENGTH = 6;

const HKDF_INFO = utf8ToBytes("vaultkeepr-zk-share-v1");
const HKDF_INFO_V2 = utf8ToBytes("vaultkeepr-zk-share-v2");



export interface SharePayload {
  version: typeof SHARE_VERSION;
  type: "credentials" | "note" | "file" | "link" | "cloud_file";


  username?: string;
  password?: string;
  url?: string;
  totpSecret?: string;


  noteTitle?: string;
  noteContent?: string;


  linkUrl?: string;
  linkTitle?: string;


  fileName?: string;
  fileMimeType?: string;
  fileData?: string;
  fileSize?: number;


  message?: string;


  senderLabel?: string;
  createdAt: number;
}

export interface ShareCreationResult {

  encryptedBlob: string;

  shareId: string;

  privateKeyHex: string;

  publicKeyHex: string;

  pin: string;

  apiPinHash: string;
}

export interface ShareOptions {
  ttl: "1h" | "24h" | "7d";
  maxViews: number;
  senderLabel?: string;
}






export function generateSharePin(): string {
  const bytes = randomBytes(4);
  const num = (bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3]) >>> 0;
  return String(num % 1000000).padStart(PIN_LENGTH, "0");
}




export function computeApiPinHash(pin: string): string {
  return bytesToHex(sha256(utf8ToBytes(pin)));
}




function generateShareId(): string {
  const ts = Date.now().toString(36);
  const rand = bytesToHex(randomBytes(8));
  return `${ts}-${rand}`;
}

















function deriveShareKeyV2(ephemeralPrivate: Uint8Array, pin: string): Uint8Array {
  const pinSalt = sha256(utf8ToBytes(pin));
  return hkdf(sha256, ephemeralPrivate, pinSalt, HKDF_INFO_V2, KEY_LENGTH);
}


function deriveShareKeyV1(sharedSecret: Uint8Array, pin: string): Uint8Array {
  const pinSalt = sha256(utf8ToBytes(pin));
  return hkdf(sha256, sharedSecret, pinSalt, HKDF_INFO, KEY_LENGTH);
}










export function createSecureShare(
payload: Omit<SharePayload, "version" | "createdAt">,
pin?: string)
: ShareCreationResult {
  const sharePin = pin ?? generateSharePin();
  const shareId = generateShareId();
  const apiPinHash = computeApiPinHash(sharePin);


  const fullPayload: SharePayload = {
    ...payload,
    version: SHARE_VERSION,
    createdAt: Date.now()
  };


  const payloadJson = JSON.stringify(fullPayload);
  const payloadBytes = utf8ToBytes(payloadJson);

  if (payloadBytes.length > MAX_PAYLOAD_SIZE) {
    throw new Error(`Payload too large: ${Math.round(payloadBytes.length / 1024 / 1024)}MB (max 5MB file)`);
  }


  const ephemeralPrivate = secp256k1.utils.randomSecretKey();

  const ephemeralPublic = secp256k1.getPublicKey(ephemeralPrivate, false);


  const shareKey = deriveShareKeyV2(ephemeralPrivate, sharePin);


  const nonce = randomBytes(NONCE_LENGTH);
  const chacha = xchacha20poly1305(shareKey, nonce);
  const ciphertext = chacha.encrypt(payloadBytes);



  const blob = new Uint8Array(1 + NONCE_LENGTH + ciphertext.length);
  let offset = 0;
  blob[offset++] = SHARE_VERSION;
  blob.set(nonce, offset);offset += NONCE_LENGTH;
  blob.set(ciphertext, offset);

  return {
    encryptedBlob: bytesToHex(blob),
    shareId,
    privateKeyHex: bytesToHex(ephemeralPrivate),
    publicKeyHex: bytesToHex(ephemeralPublic),
    pin: sharePin,
    apiPinHash
  };
}












export function decryptSecureShare(
blobHex: string,
keyHex: string,
pin: string)
: SharePayload {
  const blob = hexToBytes(blobHex);
  const keyBytes = hexToBytes(keyHex);

  let offset = 0;
  const version = blob[offset++];

  if (version === 2) {


    const nonce = blob.slice(offset, offset + NONCE_LENGTH);offset += NONCE_LENGTH;
    const ciphertext = blob.slice(offset);

    const shareKey = deriveShareKeyV2(keyBytes, pin);
    const chacha = xchacha20poly1305(shareKey, nonce);

    let plaintext: Uint8Array;
    try {
      plaintext = chacha.decrypt(ciphertext);
    } catch {
      throw new Error("Invalid PIN or corrupted share");
    }

    const json = new TextDecoder().decode(plaintext);
    return JSON.parse(json) as SharePayload;

  } else if (version === 1) {


    const pubKey = keyBytes;
    const nonce = blob.slice(offset, offset + NONCE_LENGTH);offset += NONCE_LENGTH;
    const privKeyEncNonce = blob.slice(offset, offset + NONCE_LENGTH);offset += NONCE_LENGTH;

    const ENCRYPTED_PRIVKEY_LEN = 32 + 16;
    const encryptedPrivKey = blob.slice(offset, offset + ENCRYPTED_PRIVKEY_LEN);offset += ENCRYPTED_PRIVKEY_LEN;
    const ciphertext = blob.slice(offset);


    const privKeyDecKey = hkdf(sha256, pubKey.slice(1), sha256(utf8ToBytes(pin)), utf8ToBytes("vaultkeepr-share-privkey"), KEY_LENGTH);
    const privKeyDecChacha = xchacha20poly1305(privKeyDecKey, privKeyEncNonce);

    let ephemeralPrivate: Uint8Array;
    try {
      ephemeralPrivate = privKeyDecChacha.decrypt(encryptedPrivKey);
    } catch {
      throw new Error("Invalid PIN or corrupted share");
    }


    const sharedSecret = secp256k1.getSharedSecret(ephemeralPrivate, pubKey, false);
    const sharedSecretBytes = sharedSecret.slice(1);


    const shareKey = deriveShareKeyV1(sharedSecretBytes, pin);


    const chacha = xchacha20poly1305(shareKey, nonce);
    let plaintext: Uint8Array;
    try {
      plaintext = chacha.decrypt(ciphertext);
    } catch {
      throw new Error("Decryption failed — invalid PIN or corrupted data");
    }

    const json = new TextDecoder().decode(plaintext);
    return JSON.parse(json) as SharePayload;

  } else {
    throw new Error(`Unsupported share version: ${version}`);
  }
}








export function buildShareUrl(baseUrl: string, shareId: string, keyHex: string): string {
  return `${baseUrl}/share/${shareId}#${keyHex}`;
}




export function parseShareUrl(url: string): {shareId: string;publicKeyHex: string;} | null {
  try {
    const u = new URL(url);
    const pathParts = u.pathname.split("/").filter(Boolean);
    const shareIdx = pathParts.indexOf("share");
    if (shareIdx === -1 || shareIdx + 1 >= pathParts.length) return null;
    const shareId = pathParts[shareIdx + 1];
    const publicKeyHex = u.hash.slice(1);
    if (!shareId || !publicKeyHex) return null;
    return { shareId, publicKeyHex };
  } catch {
    return null;
  }
}




export function ttlToMs(ttl: "1h" | "24h" | "7d"): number {
  switch (ttl) {
    case "1h":return 60 * 60 * 1000;
    case "24h":return 24 * 60 * 60 * 1000;
    case "7d":return 7 * 24 * 60 * 60 * 1000;
    default:return 24 * 60 * 60 * 1000;
  }
}