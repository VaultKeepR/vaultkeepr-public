






















import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";
import { randomBytes } from "@noble/ciphers/utils.js";
import { hkdf } from "@noble/hashes/hkdf.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { utf8ToBytes } from "@noble/hashes/utils.js";

const NFC_V2_PREFIX = "vk2";
const NFC_V3_PREFIX = "vk3";
const NONCE_LENGTH = 24;
const KEY_LENGTH = 32;
const DEVICE_SECRET_LENGTH = 32;
const HKDF_INFO = utf8ToBytes("vaultkeepr-nfc-v2");


function toBase64url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64url(str: string): Uint8Array {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - b64.length % 4) % 4);
  const bin = atob(padded);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}





export function generateNfcDeviceSecret(): Uint8Array {
  return randomBytes(DEVICE_SECRET_LENGTH);
}




function deriveNfcEncryptionKey(deviceSecret: Uint8Array, pin: string): Uint8Array {
  const salt = utf8ToBytes(pin);
  return hkdf(sha256, deviceSecret, salt, HKDF_INFO, KEY_LENGTH);
}



















export function encryptNfcPayload(
masterPassword: string,
deviceSecret: Uint8Array,
pin: string)
: string {
  const key = deriveNfcEncryptionKey(deviceSecret, pin);
  const nonce = randomBytes(NONCE_LENGTH);


  const isHex = /^[0-9a-f]+$/i.test(masterPassword) && masterPassword.length >= 32 && masterPassword.length % 2 === 0;
  let plainBytes: Uint8Array;
  if (isHex) {

    const hexBytes = new Uint8Array(masterPassword.length / 2);
    for (let i = 0; i < masterPassword.length; i += 2) {
      hexBytes[i / 2] = parseInt(masterPassword.slice(i, i + 2), 16);
    }
    plainBytes = new Uint8Array(1 + hexBytes.length);
    plainBytes[0] = 0x68;
    plainBytes.set(hexBytes, 1);
  } else {

    const textBytes = utf8ToBytes(masterPassword);
    plainBytes = new Uint8Array(1 + textBytes.length);
    plainBytes[0] = 0x74;
    plainBytes.set(textBytes, 1);
  }

  const chacha = xchacha20poly1305(key, nonce);
  const ciphertext = chacha.encrypt(plainBytes);


  const v2Len = 4 + Math.ceil(NONCE_LENGTH * 4 / 3) + 1 + Math.ceil(ciphertext.length * 4 / 3);


  if (v2Len > 120) {

    const combined = new Uint8Array(NONCE_LENGTH + ciphertext.length);
    combined.set(nonce, 0);
    combined.set(ciphertext, NONCE_LENGTH);
    return `${NFC_V3_PREFIX}:${toBase64url(combined)}`;
  }

  return `${NFC_V2_PREFIX}:${toBase64url(nonce)}:${toBase64url(ciphertext)}`;
}
















export function decryptNfcPayload(
payload: string,
deviceSecret: Uint8Array,
pin: string)
: string {
  const parts = payload.split(":");

  let plainBytes: Uint8Array;

  if (parts[0] === NFC_V3_PREFIX && parts.length >= 2) {

    const combined = fromBase64url(parts.slice(1).join(":"));
    if (combined.length <= NONCE_LENGTH) {
      throw new Error("Invalid NFC v3 payload: too short");
    }
    const nonce = combined.slice(0, NONCE_LENGTH);
    const ciphertext = combined.slice(NONCE_LENGTH);
    const key = deriveNfcEncryptionKey(deviceSecret, pin);
    const chacha = xchacha20poly1305(key, nonce);
    plainBytes = chacha.decrypt(ciphertext);
  } else if (parts[0] === NFC_V2_PREFIX && parts.length >= 3) {

    const nonce = fromBase64url(parts[1]);
    const ciphertext = fromBase64url(parts[2]);
    const key = deriveNfcEncryptionKey(deviceSecret, pin);
    const chacha = xchacha20poly1305(key, nonce);
    plainBytes = chacha.decrypt(ciphertext);
  } else {
    throw new Error("Invalid NFC payload format");
  }


  if (plainBytes.length > 0 && plainBytes[0] === 0x68) {

    const hexBytes = plainBytes.slice(1);
    let hex = "";
    for (let i = 0; i < hexBytes.length; i++) {
      hex += hexBytes[i].toString(16).padStart(2, "0");
    }
    return hex;
  }

  if (plainBytes.length > 0 && plainBytes[0] === 0x74) {

    return new TextDecoder().decode(plainBytes.slice(1));
  }


  return new TextDecoder().decode(plainBytes);
}




export function isNfcPayloadV2(payload: string): boolean {
  return payload.startsWith(NFC_V2_PREFIX + ":");
}




export function isNfcPayloadV3(payload: string): boolean {
  return payload.startsWith(NFC_V3_PREFIX + ":");
}




export function isNfcPayloadV1(payload: string): boolean {
  return payload.startsWith("vk1:");
}