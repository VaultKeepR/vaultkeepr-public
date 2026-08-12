









import { p256 } from "@noble/curves/nist.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { hkdf } from "@noble/hashes/hkdf.js";
import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";
import { randomBytes } from "@noble/ciphers/utils.js";
import { bytesToHex, hexToBytes, utf8ToBytes } from "@noble/hashes/utils.js";



export interface PasskeyKeyPair {
  privateKey: Uint8Array;
  publicKey: Uint8Array;
  publicKeyCose: Uint8Array;
}







export function generatePasskeyKeyPair(): PasskeyKeyPair {
  const privateKey = p256.utils.randomSecretKey();
  const publicKey = p256.getPublicKey(privateKey, false);
  const publicKeyCose = publicKeyToCose(publicKey);
  return { privateKey, publicKey, publicKeyCose };
}




export function generateCredentialId(): Uint8Array {
  return randomBytes(16);
}







const COSE_KTY_EC2 = 2;
const COSE_CRV_P256 = 1;















export function publicKeyToCose(publicKey: Uint8Array): Uint8Array {
  if (publicKey.length !== 65 || publicKey[0] !== 0x04) {
    throw new Error("Expected 65-byte uncompressed P-256 public key");
  }
  const x = publicKey.slice(1, 33);
  const y = publicKey.slice(33, 65);


  const parts: number[] = [];


  parts.push(0xa5);


  parts.push(0x01);
  parts.push(COSE_KTY_EC2);


  parts.push(0x03);
  parts.push(0x26);


  parts.push(0x20);
  parts.push(COSE_CRV_P256);


  parts.push(0x21);
  parts.push(0x58, 0x20);
  for (let i = 0; i < 32; i++) parts.push(x[i]);


  parts.push(0x22);
  parts.push(0x58, 0x20);
  for (let i = 0; i < 32; i++) parts.push(y[i]);

  return new Uint8Array(parts);
}















export function signPasskeyAssertion(
privateKey: Uint8Array,
authenticatorData: Uint8Array,
clientDataHash: Uint8Array)
: Uint8Array {

  const signedData = new Uint8Array(
    authenticatorData.length + clientDataHash.length
  );
  signedData.set(authenticatorData);
  signedData.set(clientDataHash, authenticatorData.length);




  const digest = sha256(signedData);
  const signature = p256.sign(digest, privateKey, {
    prehash: false,
    format: "der"
  });


  return signature;
}




export function verifyPasskeyAssertion(
publicKey: Uint8Array,
authenticatorData: Uint8Array,
clientDataHash: Uint8Array,
signature: Uint8Array)
: boolean {
  const signedData = new Uint8Array(
    authenticatorData.length + clientDataHash.length
  );
  signedData.set(authenticatorData);
  signedData.set(clientDataHash, authenticatorData.length);
  const digest = sha256(signedData);
  return p256.verify(signature, digest, publicKey, {
    prehash: false,
    format: "der"
  });
}






export function rpIdHash(rpId: string): Uint8Array {
  return sha256(new TextEncoder().encode(rpId));
}
















export function buildAuthDataForCreate(
rpId: string,
credentialId: Uint8Array,
publicKeyCose: Uint8Array,
counter: number = 0)
: Uint8Array {
  const rpHash = rpIdHash(rpId);
  const flags = 0x45;


  const aaguid = new Uint8Array(16);

  const credIdLen = new Uint8Array(2);
  credIdLen[0] = credentialId.length >> 8 & 0xff;
  credIdLen[1] = credentialId.length & 0xff;

  const counterBytes = new Uint8Array(4);
  counterBytes[0] = counter >> 24 & 0xff;
  counterBytes[1] = counter >> 16 & 0xff;
  counterBytes[2] = counter >> 8 & 0xff;
  counterBytes[3] = counter & 0xff;

  const totalLen =
  32 + 1 + 4 + 16 + 2 + credentialId.length + publicKeyCose.length;
  const authData = new Uint8Array(totalLen);
  let offset = 0;

  authData.set(rpHash, offset);
  offset += 32;
  authData[offset++] = flags;
  authData.set(counterBytes, offset);
  offset += 4;
  authData.set(aaguid, offset);
  offset += 16;
  authData.set(credIdLen, offset);
  offset += 2;
  authData.set(credentialId, offset);
  offset += credentialId.length;
  authData.set(publicKeyCose, offset);

  return authData;
}












export function buildAuthDataForGet(
rpId: string,
counter: number,
userVerification: "required" | "preferred" | "discouraged" = "preferred")
: Uint8Array {
  const rpHash = rpIdHash(rpId);


  const flags = userVerification === "discouraged" ? 0x01 : 0x05;

  const authData = new Uint8Array(37);
  authData.set(rpHash);
  authData[32] = flags;
  authData[33] = counter >> 24 & 0xff;
  authData[34] = counter >> 16 & 0xff;
  authData[35] = counter >> 8 & 0xff;
  authData[36] = counter & 0xff;

  return authData;
}













export function buildAttestationObject(authData: Uint8Array): Uint8Array {

  const parts: number[] = [];


  parts.push(0xa3);



  parts.push(0x63, 0x66, 0x6d, 0x74);

  parts.push(0x64, 0x6e, 0x6f, 0x6e, 0x65);



  parts.push(0x67, 0x61, 0x74, 0x74, 0x53, 0x74, 0x6d, 0x74);

  parts.push(0xa0);



  parts.push(0x68, 0x61, 0x75, 0x74, 0x68, 0x44, 0x61, 0x74, 0x61);

  if (authData.length < 24) {
    parts.push(0x40 | authData.length);
  } else if (authData.length < 256) {
    parts.push(0x58, authData.length);
  } else {
    parts.push(0x59, authData.length >> 8 & 0xff, authData.length & 0xff);
  }
  for (let i = 0; i < authData.length; i++) {
    parts.push(authData[i]);
  }

  return new Uint8Array(parts);
}



export function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).
  replace(/\+/g, "-").
  replace(/\//g, "_").
  replace(/=+$/, "");
}

export function fromBase64Url(str: string): Uint8Array {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - base64.length % 4) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}



export { bytesToHex, hexToBytes };















const PASSKEY_KEY_HKDF_INFO = utf8ToBytes("passkey-private-key");

export function encryptPasskeyPrivateKey(
privateKey: Uint8Array,
masterKey: Uint8Array,
credentialId: string)
: string {
  const credBytes = utf8ToBytes(credentialId);
  const subKey = hkdf(sha256, masterKey, credBytes, PASSKEY_KEY_HKDF_INFO, 32);
  const nonce = randomBytes(24);
  const chacha = xchacha20poly1305(subKey, nonce);
  const ciphertext = chacha.encrypt(privateKey);

  const combined = new Uint8Array(nonce.length + ciphertext.length);
  combined.set(nonce);
  combined.set(ciphertext, nonce.length);
  return bytesToHex(combined);
}

export function decryptPasskeyPrivateKey(
encryptedHex: string,
masterKey: Uint8Array,
credentialId: string)
: Uint8Array {
  const combined = hexToBytes(encryptedHex);
  if (combined.length < 24 + 16) {
    throw new Error("Invalid encrypted passkey private key length");
  }
  const nonce = combined.slice(0, 24);
  const ciphertext = combined.slice(24);
  const credBytes = utf8ToBytes(credentialId);
  const subKey = hkdf(sha256, masterKey, credBytes, PASSKEY_KEY_HKDF_INFO, 32);
  const chacha = xchacha20poly1305(subKey, nonce);
  return chacha.decrypt(ciphertext);
}






export function isPasskeyPrivateKeyEncrypted(privateKeyHex: string): boolean {


  return privateKeyHex.length === 144;
}