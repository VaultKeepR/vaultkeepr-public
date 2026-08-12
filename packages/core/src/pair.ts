
















import { p256 } from "@noble/curves/nist.js";
import { hkdf } from "@noble/hashes/hkdf.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";
import { randomBytes } from "@noble/ciphers/utils.js";
import { bytesToHex, hexToBytes, utf8ToBytes } from "@noble/hashes/utils.js";



const PAIR_HKDF_INFO = utf8ToBytes("vaultkeepr-pair-v1");
const NONCE_LENGTH = 24;
const KEY_LENGTH = 32;


export const PAIR_URI_SCHEME = "vk-pair://";



export interface PairKeypair {
  privateKey: Uint8Array;
  publicKeyHex: string;
}

export interface PairPayload {
  version: 1;
  vault: unknown;
  masterPassword: string;
  authType: "password" | "passkey";
  walletAddress?: string;
  licenseKey?: string;
  secretKey?: string;
  transferredAt: number;
}

export interface ParsedPairUri {
  sessionId: string;
  publicKeyHex: string;
}







export function generatePairKeypair(): PairKeypair {
  const privateKey = p256.utils.randomSecretKey();
  const publicKey = p256.getPublicKey(privateKey, false);
  return {
    privateKey,
    publicKeyHex: bytesToHex(publicKey)
  };
}









export function derivePairSecret(
myPrivateKey: Uint8Array,
theirPublicKeyHex: string)
: Uint8Array {
  const theirPubKey = hexToBytes(theirPublicKeyHex);

  const sharedPoint = p256.getSharedSecret(myPrivateKey, theirPubKey);

  return hkdf(sha256, sharedPoint.slice(1), undefined, PAIR_HKDF_INFO, KEY_LENGTH);
}







export function encryptForPair(plaintext: string, sharedSecret: Uint8Array): string {
  const nonce = randomBytes(NONCE_LENGTH);
  const chacha = xchacha20poly1305(sharedSecret, nonce);
  const ciphertextBytes = chacha.encrypt(utf8ToBytes(plaintext));

  const combined = new Uint8Array(NONCE_LENGTH + ciphertextBytes.length);
  combined.set(nonce);
  combined.set(ciphertextBytes, NONCE_LENGTH);

  return bytesToHex(combined);
}





export function decryptFromPair(encryptedHex: string, sharedSecret: Uint8Array): string {
  const data = hexToBytes(encryptedHex);
  if (data.length < NONCE_LENGTH + 16) {
    throw new Error("Invalid pair payload: too short");
  }

  const nonce = data.slice(0, NONCE_LENGTH);
  const ciphertext = data.slice(NONCE_LENGTH);
  const chacha = xchacha20poly1305(sharedSecret, nonce);
  const plaintext = chacha.decrypt(ciphertext);

  return new TextDecoder().decode(plaintext);
}




export const PAIR_SEND_URI_SCHEME = "vk-pair-send://";





export function buildPairUri(sessionId: string, publicKeyHex: string): string {
  return `${PAIR_URI_SCHEME}${sessionId}/${publicKeyHex}`;
}





export function buildPairSendUri(sessionId: string, publicKeyHex: string): string {
  return `${PAIR_SEND_URI_SCHEME}${sessionId}/${publicKeyHex}`;
}





export function parsePairUri(uri: string): ParsedPairUri | null {
  if (!uri.startsWith(PAIR_URI_SCHEME)) return null;

  const rest = uri.slice(PAIR_URI_SCHEME.length);
  const slashIndex = rest.indexOf("/");
  if (slashIndex < 1) return null;

  const sessionId = rest.slice(0, slashIndex);
  const publicKeyHex = rest.slice(slashIndex + 1);


  if (!sessionId || sessionId.length < 10) return null;
  if (!publicKeyHex || publicKeyHex.length !== 130) return null;
  if (!/^[0-9a-f]+$/i.test(publicKeyHex)) return null;

  return { sessionId, publicKeyHex };
}




export function parsePairSendUri(uri: string): ParsedPairUri | null {
  if (!uri.startsWith(PAIR_SEND_URI_SCHEME)) return null;

  const rest = uri.slice(PAIR_SEND_URI_SCHEME.length);
  const slashIndex = rest.indexOf("/");
  if (slashIndex < 1) return null;

  const sessionId = rest.slice(0, slashIndex);
  const publicKeyHex = rest.slice(slashIndex + 1);

  if (!sessionId || sessionId.length < 10) return null;
  if (!publicKeyHex || publicKeyHex.length !== 130) return null;
  if (!/^[0-9a-f]+$/i.test(publicKeyHex)) return null;

  return { sessionId, publicKeyHex };
}




export function isPairUri(uri: string): boolean {
  return uri.startsWith(PAIR_URI_SCHEME) || uri.startsWith(PAIR_SEND_URI_SCHEME);
}




export function isPairSendUri(uri: string): boolean {
  return uri.startsWith(PAIR_SEND_URI_SCHEME);
}






export function buildPairPayload(
vault: unknown,
masterPassword: string,
authType: "password" | "passkey",
walletAddress?: string,
licenseKey?: string,
secretKey?: string)
: PairPayload {
  return {
    version: 1,
    vault,
    masterPassword,
    authType,
    walletAddress,
    licenseKey,
    secretKey,
    transferredAt: Date.now()
  };
}




export function parsePairPayload(json: string): PairPayload {
  const data = JSON.parse(json);
  if (
  typeof data !== "object" ||
  data === null ||
  data.version !== 1 ||
  typeof data.masterPassword !== "string" ||
  !data.vault)
  {
    throw new Error("Invalid pair payload format");
  }
  return data as PairPayload;
}