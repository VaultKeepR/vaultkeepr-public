














import { secp256k1 } from "@noble/curves/secp256k1.js";
import { hkdf } from "@noble/hashes/hkdf.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";
import { randomBytes } from "@noble/ciphers/utils.js";
import { utf8ToBytes, bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import type {
  LegacyEnvelope,
  LegacyEnvelopeBundle,
  LegacyPayload,
  BeneficiaryInfo } from
"./types";
import { HKDF_LEGACY_INFO, LEGACY_VERSION } from "./types";
import type { Address } from "viem";

const NONCE_LENGTH = 24;
const KEY_LENGTH = 32;







function deriveEnvelopeKey(
privateKeyHex: string,
otherPublicKeyHex: string)
: Uint8Array {

  const privateKey = hexToBytes(privateKeyHex.replace(/^0x/, ""));
  const otherPublicKey = hexToBytes(otherPublicKeyHex.replace(/^0x/, ""));
  const sharedPoint = secp256k1.getSharedSecret(privateKey, otherPublicKey);


  const info = utf8ToBytes(HKDF_LEGACY_INFO);
  return hkdf(sha256, sharedPoint, undefined, info, KEY_LENGTH);
}












export function createEnvelope(
ownerPrivateKey: string,
ownerPublicKey: string,
beneficiaryPublicKey: string,
masterKey: string,
vaultCid: string)
: LegacyEnvelope {
  const envelopeKey = deriveEnvelopeKey(ownerPrivateKey, beneficiaryPublicKey);
  const nonce = randomBytes(NONCE_LENGTH);


  const payload: LegacyPayload = { masterKey, vaultCid };
  const plaintext = utf8ToBytes(JSON.stringify(payload));

  const cipher = xchacha20poly1305(envelopeKey, nonce);
  const ciphertext = cipher.encrypt(plaintext);

  return {
    version: LEGACY_VERSION,
    ownerPublicKey: ownerPublicKey.replace(/^0x/, ""),
    beneficiaryPublicKey: beneficiaryPublicKey.replace(/^0x/, ""),
    ciphertext: bytesToHex(ciphertext),
    nonce: bytesToHex(nonce)
  };
}











export function decryptEnvelope(
beneficiaryPrivateKey: string,
envelope: LegacyEnvelope)
: LegacyPayload {
  const envelopeKey = deriveEnvelopeKey(
    beneficiaryPrivateKey,
    envelope.ownerPublicKey
  );
  const nonce = hexToBytes(envelope.nonce);
  const ciphertext = hexToBytes(envelope.ciphertext);

  const cipher = xchacha20poly1305(envelopeKey, nonce);
  const plaintext = cipher.decrypt(ciphertext);

  const json = new TextDecoder().decode(plaintext);
  const payload = JSON.parse(json) as LegacyPayload;

  if (!payload.masterKey || !payload.vaultCid) {
    throw new Error("Invalid legacy payload: missing masterKey or vaultCid");
  }

  return payload;
}













export function createEnvelopeBundle(
ownerPrivateKey: string,
beneficiaries: BeneficiaryInfo[],
masterKey: string,
vaultCid: string,
ownerAddress: Address)
: LegacyEnvelopeBundle {

  const ownerPubKey = bytesToHex(
    secp256k1.getPublicKey(hexToBytes(ownerPrivateKey.replace(/^0x/, "")), true)
  );

  const envelopes: Record<string, LegacyEnvelope> = {};
  for (const b of beneficiaries) {
    envelopes[b.address.toLowerCase()] = createEnvelope(
      ownerPrivateKey,
      ownerPubKey,
      b.publicKey,
      masterKey,
      vaultCid
    );
  }

  return {
    version: LEGACY_VERSION,
    owner: ownerAddress,
    envelopes,
    createdAt: Date.now()
  };
}




export function decryptFromBundle(
beneficiaryPrivateKey: string,
beneficiaryAddress: Address,
bundle: LegacyEnvelopeBundle)
: LegacyPayload {
  const envelope = bundle.envelopes[beneficiaryAddress.toLowerCase()];
  if (!envelope) {
    throw new Error(`No envelope found for beneficiary ${beneficiaryAddress}`);
  }
  return decryptEnvelope(beneficiaryPrivateKey, envelope);
}







export function hashEnvelopeBundle(bundle: LegacyEnvelopeBundle): string {
  const json = JSON.stringify(bundle);
  const hash = sha256(utf8ToBytes(json));
  return bytesToHex(hash);
}






export function getPublicKeyFromPrivate(privateKeyHex: string): string {
  const privKey = hexToBytes(privateKeyHex.replace(/^0x/, ""));
  return bytesToHex(secp256k1.getPublicKey(privKey, true));
}




export function isValidPublicKey(publicKeyHex: string): boolean {
  try {
    const hex = publicKeyHex.replace(/^0x/, "");
    if (hex.length !== 66 && hex.length !== 130) return false;

    const PointClass = (secp256k1 as any).ProjectivePoint || (secp256k1 as any).Point;
    PointClass.fromHex(hex);
    return true;
  } catch {
    return false;
  }
}